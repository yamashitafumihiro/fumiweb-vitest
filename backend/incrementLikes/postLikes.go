package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

func post(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("ap-northeast-1"),
	}))

	svc := dynamodb.New(sess)

	postID := request.QueryStringParameters["post_id"]
	action := request.QueryStringParameters["action"]

	var delta int
	switch action {
	case "inc":
		delta = 1
	case "dec":
		delta = -1
	default:
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Invalid action parameter",
		}, nil
	}

	input := &dynamodb.UpdateItemInput{
		TableName: aws.String("likes"),
		Key: map[string]*dynamodb.AttributeValue{
			"post_id": {
				S: aws.String(postID),
			},
		},
		UpdateExpression: aws.String("SET likes = if_not_exists(likes, :start) + :delta"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":delta": {N: aws.String(strconv.Itoa(delta))},
			":start": {N: aws.String("0")},
		},
		ReturnValues: aws.String("UPDATED_NEW"),
	}

	result, err := svc.UpdateItem(input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf("Failed to update item %v", err),
		}, nil
	}

	updatedLikes := result.Attributes["likes"].N

	responseBody, _ := json.Marshal(map[string]string{
		"post_id": postID,
		"likes":   *updatedLikes,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
	}, nil
}
