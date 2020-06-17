export const handler = async (event: any = {}, context: any): Promise<any> => {
    console.log("Starting demo lambda handler.");

    let region = process.env.AWS_REGION
    let status = process.env.STATUS

    var responseBody = {
        "region": region,
        "status": status
    };

    const response = {
        "statusCode": 200,
        "body": JSON.stringify(responseBody),
    };

    return response;
}