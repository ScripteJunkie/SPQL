package validate

import (
	"context"
	"net/http"
	"os"
	"strings"
	"sync"

	openai "github.com/sashabaranov/go-openai"
)

func ValidationTemplate(w http.ResponseWriter, prompt string, table_info string, dialect string) (bool, bool, string, string, bool, bool) {
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

func cleanBoolean(s string) bool {
	if strings.Contains(s, "True") {
		return true
	} else {
		return false
	}
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
	// client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
	// ctx := context.Background()

	// query := "Say true or false if prompt can be successfully query by database without errors. Some data can be got by grouping or counting results, but don't make up columns." + "\nThe prompt is: " + prompt + "\nThe schema is: " + table_info + "\nTrue or False and why?"

	// req := openai.CompletionRequest{
	// 	Model:            openai.GPT3TextDavinci003,
	// 	MaxTokens:        500,
	// 	Temperature:      0.0,
	// 	TopP:             1.0,
	// 	FrequencyPenalty: 0.0,
	// 	PresencePenalty:  0.0,
	// 	Prompt:           query,
	// }

	// dataresp, err := client.CreateCompletion(ctx, req)
	// if err != nil {
	// 	log.Fatalln(err)
	// 	return false, "", true
	// }

	// println(dataresp.Choices[0].Text)

	// cleanBool := !cleanBoolean(dataresp.Choices[0].Text)
	// cleanErr := strings.ReplaceAll(strings.ReplaceAll(dataresp.Choices[0].Text, "True.", ""), "False.", "")

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

	// return cleanBool, cleanErr, false
	return false, "", false
}
