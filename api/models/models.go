package models

type QueryRequest struct {
	AppId    string `json:"app_id"`
	Prompt   string `json:"prompt"`
	SchemaId string `json:"schema_id"`
	User     string `json:"user",omitempty`
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
