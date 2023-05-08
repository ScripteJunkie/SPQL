package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	firebase "firebase.google.com/go"
	dotenv "github.com/joho/godotenv"
	ulid "github.com/oklog/ulid/v2"
	openai "github.com/sashabaranov/go-openai"
)

type QueryRequest struct {
	Prompt  string `json:"prompt"`
	Dialect string `json:"dialect"`
	User    string `json:"user",omitempty`
}

type QueryResponse struct {
	Request   string `json:"request"`
	RequestId string `json:"request_id"`
	User      string `json:"user"`
	Query     string `json:"query"`
	Notes     string `json:"notes"`
	Error     string `json:"error"`
}

type Message struct {
	Request string `json:"request"`
	Query   string `json:"query"`
	Notes   string `json:"notes"`
	Error   string `json:"error"`
}

var projectID = "spql-host"

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
		w.Write([]byte("SPQL API"))
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

func cleanBoolean(s string) bool {
	if strings.Contains(s, "True") {
		return true
	} else {
		return false
	}
}

func getSchema(schemaId string) string {
	ctx := context.Background()
	conf := &firebase.Config{ProjectID: projectID}
	app, err := firebase.NewApp(ctx, conf)
	if err != nil {
		log.Fatalln(err)
		return "Error"
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
		return "Error"
	}
	defer client.Close()

	doc := client.Collection("schema").Doc(schemaId)
	docsnap, err := doc.Get(ctx)
	if err != nil {
		log.Fatalln(err)
		return "Error"
	}

	docdata := docsnap.Data()
	return docdata["schema"].(string)
}

// hasPii (bool), What PII (string), error (bool)
func checkPII(prompt string, table_info string, wg *sync.WaitGroup) (bool, string, bool) {
	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
	ctx := context.Background()
	piiResp, _ := client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model:            openai.GPT3Dot5Turbo,
			Temperature:      0.0,
			MaxTokens:        200,
			PresencePenalty:  0.0,
			FrequencyPenalty: 0.0,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "You are an AI that only responds True or False!",
				},
				{
					Role:    openai.ChatMessageRoleAssistant,
					Content: "True",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "PROMPT: " + prompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "SCHEMA: " + table_info,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "Does the prompt require PII? True or False and which PII is needed?",
				},
			},
		},
	)

	if piiResp.Choices[0].Message.Content != "" {
		cleanBool := cleanBoolean(piiResp.Choices[0].Message.Content)
		cleanErr := strings.ReplaceAll(strings.ReplaceAll(piiResp.Choices[0].Message.Content, "True.", ""), "False.", "")

		return cleanBool, cleanErr, false
	} else {
		return false, "", true
	}
}

// hasData (bool), Why Data (string), error (bool)
func checkData(prompt string, table_info string, wg *sync.WaitGroup) (bool, string, bool) {
	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
	ctx := context.Background()

	query := "Say true or false if prompt can be successfully query by database without errors. Some data can be got by grouping or counting results, but don't make up columns." + "\nThe prompt is: " + prompt + "\nThe schema is: " + table_info + "\nTrue or False and why?"

	req := openai.CompletionRequest{
		Model:            openai.GPT3TextDavinci003,
		MaxTokens:        500,
		Temperature:      0.0,
		TopP:             1.0,
		FrequencyPenalty: 0.0,
		PresencePenalty:  0.0,
		Prompt:           query,
	}

	dataresp, err := client.CreateCompletion(ctx, req)
	if err != nil {
		log.Fatalln(err)
		return false, "", true
	}

	println(dataresp.Choices[0].Text)

	cleanBool := !cleanBoolean(dataresp.Choices[0].Text)
	cleanErr := strings.ReplaceAll(strings.ReplaceAll(dataresp.Choices[0].Text, "True.", ""), "False.", "")

	// dataResp, _ := client.CreateChatCompletion(
	// 	ctx,
	// 	openai.ChatCompletionRequest{
	// 		Model:            openai.GPT3Dot5Turbo,
	// 		Temperature:      0.0,
	// 		MaxTokens:        200,
	// 		PresencePenalty:  0.0,
	// 		FrequencyPenalty: 0.0,
	// 		Messages: []openai.ChatCompletionMessage{
	// 			{
	// 				Role:    openai.ChatMessageRoleUser,
	// 				Content: "You are an AI that only responds True or False!",
	// 			},
	// 			{
	// 				Role:    openai.ChatMessageRoleAssistant,
	// 				Content: "True",
	// 			},
	// 			{
	// 				Role:    openai.ChatMessageRoleUser,
	// 				Content: "PROMPT: " + prompt,
	// 			},
	// 			{
	// 				Role:    openai.ChatMessageRoleUser,
	// 				Content: "SCHEMA: " + table_info,
	// 			},
	// 			{
	// 				Role:    openai.ChatMessageRoleUser,
	// 				Content: "Can the above question be answered using the given database schema? If the required information is not available in the schema, AI cannot generate or make up the missing data. However you may just need to group and count columns.  True or False and what's the problem?",
	// 			},
	// 		},
	// 	},
	// )

	// cleanBool := !cleanBoolean(dataResp.Choices[0].Message.Content)
	// cleanErr := strings.ReplaceAll(strings.ReplaceAll(dataResp.Choices[0].Message.Content, "True.", ""), "False.", "")

	return cleanBool, cleanErr, false
}

func validationTemplate(w http.ResponseWriter, prompt string, table_info string, dialect string) (bool, bool, string, string, bool, bool) {
	var wg sync.WaitGroup // New wait group
	wg.Add(2)

	var hasData bool
	var hasPII bool
	var whyData string
	var whyPII string
	var errorData bool
	var errorPII bool

	go func() {
		defer wg.Done()
		hasPII, whyPII, errorPII = checkPII(prompt, table_info, &wg)
	}()

	go func() {
		defer wg.Done()
		hasData, whyData, errorData = checkData(prompt, table_info, &wg)
	}()

	wg.Wait()

	return hasData, hasPII, whyData, whyPII, errorData, errorPII
}

func getQuery(w http.ResponseWriter, r *http.Request) {
	body := r.Body
	defer body.Close()

	var queryRequest QueryRequest
	err := json.NewDecoder(body).Decode(&queryRequest)
	if err != nil {
		log.Println(r.RemoteAddr, r.Method, r.URL.Path, "Error", err.Error())
		var Err QueryResponse
		Err.Error = err.Error()
		Err.User = queryRequest.User
		Err.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, Err)
		return
	}

	log.Println(r.RemoteAddr, r.Method, r.URL.Path, queryRequest)

	schema := getSchema("01GZJJ85RB08C8QW2RK800ZYPJ")

	hasData, hasPII, whyData, whyPII, errorData, errorPII := validationTemplate(w, queryRequest.Prompt, schema, queryRequest.Dialect)

	if hasData || errorData {
		var check QueryResponse
		check.Error = "Missing Data: " + whyData
		check.User = queryRequest.User
		check.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, check)
		return
	}

	// TODO: Add PII check
	if hasPII && false || errorPII {
		var check QueryResponse
		check.Error = "Missing PII: " + whyPII
		check.User = queryRequest.User
		check.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, check)
		return
	}

	query := queryTemplate(queryRequest.Prompt, schema, queryRequest.Dialect)

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
		var Err QueryResponse
		Err.Error = err.Error()
		Err.User = queryRequest.User
		Err.RequestId = ulid.MustNew(ulid.Now(), nil).String()
		response(w, http.StatusBadRequest, Err)
		return
	}

	var jsonMap Message
	json.Unmarshal([]byte(resp.Choices[0].Text), &jsonMap)

	responseData := QueryResponse{
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

func queryTemplate(request any, table_info string, dialect string) string {
	template := `Time: ` + time.Now().Format("2006-01-02 15:04:05") + `
Intsructions:
Given real request about the tables, create syntactically correct ` + dialect + ` query or code to run.
If request not about tables or invalid or madeup, return an error message. Illegal to imagine data and only respond to a request about the tables given.
Join tables together to get the right answer, if need. Request for active only and dont assume anything else, unless told.
If query return too many row, limit amount.

Use JSON format and only answer following:

{
	"request": "given request here",
	"query": "` + dialect + ` query or code in quotes here",
	"notes": "Notes about query here including modifications/options/assumptions of the query",
	"error": "error message here if any",
}

Only use the following schema:

` + table_info + `

If request not valid (i.e. "console.log", "requestall()", "SELECT", "the 2nd president", column doesn't exist), return error message and leave query blank.
Do not assume fields or columns or tables exist, unless told.
Request: "` + fmt.Sprintf("%s", request) + `"

JSON:
`
	return template
}
