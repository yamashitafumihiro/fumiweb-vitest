package lambdaFunctions

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type LikeData struct {
	PostID string `json:"post_id"`
	Likes  int    `json:"likes"`
}

func Get(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("ap-northeast-1"),
	}))

	svc := dynamodb.New(sess)

	postID := request.QueryStringParameters["post_id"]

	input := &dynamodb.GetItemInput{
		TableName: aws.String("likes"),
		Key: map[string]*dynamodb.AttributeValue{
			"post_id": {
				S: aws.String(postID),
			},
		},
	}

	result, err := svc.GetItem(input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf("Failed to get item %v", err),
		}, nil
	}

	var likeData LikeData
	if err := dynamodbattribute.UnmarshalMap(result.Item, &likeData); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf("Failed to unmarshal item: %v", err),
		}, nil
	}

	responseBody, _ := json.Marshal(likeData)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
	}, nil
}