import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

interface PostBody {
    action: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const {httpMethod, pathParameters, body} = event;
    const postId = pathParameters?.postId;

    const tableName = 'Likes';

    if (!postId) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({error: 'postId is required'}),
        };
    }

    try {
        if (httpMethod === 'GET') {
            // Get likes
            const params = {
                TableName: tableName,
                Key: {postId},
            };
            const result = await dynamodb.get(params).promise();
            const likes = result.Item ? result.Item.likes : 0;

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({likes}),
            };
        } else if (httpMethod === 'POST') {
            // Update likes
            if (!body) {
                return {
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*", // 必要に応じて調整
                        "Access-Control-Allow-Credentials": true,
                    },
                    body: JSON.stringify({error: 'Request body is required'}),
                };
            }

            const {action}: PostBody = JSON.parse(body);
            const increment = action === 'like' ? 1 : -1;

            const params = {
                TableName: tableName,
                Key: {postId},
                UpdateExpression: 'ADD likes :inc',
                ExpressionAttributeValues: {':inc': increment},
                ReturnValues: 'UPDATED_NEW',
            };

            const result = await dynamodb.update(params).promise();

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // 必要に応じて調整
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({likes: result.Attributes?.likes}),
            };
        }

        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*", // 必要に応じて調整
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({error: 'Invalid request'}),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({error: 'Internal server error'}),
        };
    }
};
