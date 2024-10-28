package main

import (
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/yamashitafumihiro/likes/lambdaFunctions"
)

func main() {
	lambda.Start(lambdaFunctions.Get)
}
