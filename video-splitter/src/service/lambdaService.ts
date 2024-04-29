import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda';

export const invokeRecognizer = async (funcName: string, payload: string) => {
  const client = new LambdaClient({ region: 'us-east-1', logger: undefined });
  const command = new InvokeCommand({
    FunctionName: funcName,
    LogType: LogType.Tail,
    Payload: payload,
  });
  const response = await client.send(command);
};
