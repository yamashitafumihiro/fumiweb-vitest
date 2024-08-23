import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

interface PostBody {
    action: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Full event:', JSON.stringify(event, null, 2));
    console.log('Path parameters:', event.pathParameters);
    console.log('postId:', event.pathParameters?.postId);

    const {httpMethod, pathParameters, body} = event;
    const postId = pathParameters?.postId;
    console.log('Extracted data:', {httpMethod, pathParameters, postId, body});

    const tableName = 'Likes';

    if (!postId) {
        console.log('postId is missing');
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
            console.log('GET request received for postId:', postId);
            const params = {
                TableName: tableName,
                Key: {postId},
            };
            console.log('DynamoDB params:', JSON.stringify(params, null, 2));
            const result = await dynamodb.get(params).promise();
            console.log('DynamoDB GET result:', JSON.stringify(result, null, 2));
            console.log('DynamoDB GET result:', JSON.stringify(result, null, 2));
            const likes = result.Item ? result.Item.likes : 0;
            console.log('Returning likes:', likes);

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({likes: likes}),
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

            console.log('DynamoDB params:', JSON.stringify(params, null, 2));
            const result = await dynamodb.update(params).promise();
            console.log('DynamoDB UPDATE result:', JSON.stringify(result, null, 2));

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // 必要に応じて調整
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({likes: result.Attributes?.likes}),
            };
        } else {
            return {
                statusCode: 405,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({error: 'Method Not Allowed'}),
            };
        }
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
