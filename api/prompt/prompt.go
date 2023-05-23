package prompt

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	firebase "firebase.google.com/go"
)

func GetSchema(appId string, schemaId string) (string, string) {
	ctx := context.Background()
	conf := &firebase.Config{ProjectID: os.Getenv("PROJECT_KEY")}
	app, err := firebase.NewApp(ctx, conf)
	if err != nil {
		log.Fatalln(err)
		return "Error", "Error"
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
		return "Error", "Error"
	}
	defer client.Close()

	doc := client.Collection("schema").Doc(appId).Collection("schema").Doc(schemaId)
	docsnap, err := doc.Get(ctx)
	if err != nil {
		log.Fatalln(err)
		return "Error", "Error"
	}

	docdata := docsnap.Data()
	return docdata["dialect"].(string), docdata["schema"].(string)
}

func QueryTemplate(request any, table_info string, dialect string) string {
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
