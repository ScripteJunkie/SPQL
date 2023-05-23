package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	dotenv "github.com/joho/godotenv"
	ulid "github.com/oklog/ulid/v2"
	openai "github.com/sashabaranov/go-openai"

	md "main/models"
	pmt "main/prompt"
	vld "main/validate"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Instance: %s", ulid.MustNew(ulid.Now(), nil).String())

	loadErr := dotenv.Load()
	if loadErr != nil {
		log.Fatal("Error loading .env file")
	}

	http.HandleFunc("/callout", getQuery)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		w.Write([]byte("Data Jungle API"))
	})

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

func response(w http.ResponseWriter, s int, message interface{}) int {
	response, _ := json.Marshal(message)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(s)
	w.Write(response)
	return s
}

func getQuery(w http.ResponseWriter, r *http.Request) {
	body := r.Body
	defer body.Close()

	var queryRequest md.QueryRequest
	err := json.NewDecoder(body).Decode(&queryRequest)
	if err != nil {
		log.Println(r.RemoteAddr, r.Method, r.URL.Path, "Error", err.Error())
		var Err md.QueryResponse
		Err.Error = err.Error()
		Err.User = queryRequest.User
		Err.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, Err)
		return
	}

	log.Println(r.RemoteAddr, r.Method, r.URL.Path, queryRequest)

	dialect, schema := pmt.GetSchema(queryRequest.AppId, queryRequest.SchemaId)

	hasData, hasPII, whyData, whyPII, errorData, errorPII := vld.ValidationTemplate(w, queryRequest.Prompt, schema, dialect)

	if hasData || errorData {
		var check md.QueryResponse
		check.Error = "Missing Data: " + whyData
		check.User = queryRequest.User
		check.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, check)
		return
	}

	// TODO: Add PII check
	if hasPII && false || errorPII {
		var check md.QueryResponse
		check.Error = "Missing PII: " + whyPII
		check.User = queryRequest.User
		check.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, check)
		return
	}

	query := pmt.QueryTemplate(queryRequest.Prompt, schema, dialect)

	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
	ctx := context.Background()

	req := openai.CompletionRequest{
		Model:            openai.GPT3TextDavinci003,
		MaxTokens:        1000,
		Temperature:      0.0,
		TopP:             1.0,
		FrequencyPenalty: 0.0,
		PresencePenalty:  0.0,
		Prompt:           query,
		User:             queryRequest.User,
	}

	resp, err := client.CreateCompletion(ctx, req)
	if err != nil {
		var Err md.QueryResponse
		Err.Error = err.Error()
		Err.User = queryRequest.User
		Err.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, Err)
		return
	}

	var jsonMap md.Message
	json.Unmarshal([]byte(resp.Choices[0].Text), &jsonMap)

	responseData := md.QueryResponse{
		Request:   queryRequest.Prompt,
		RequestId: ulid.Make().String(),
		Query:     jsonMap.Query,
		Notes:     jsonMap.Notes,
		Error:     jsonMap.Error,
		User:      queryRequest.User,
	}

	if jsonMap.Query != "" {
		responseData.Error = ""
	}

	response(w, http.StatusOK, responseData)
}
