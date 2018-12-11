const apigClientFactory = require('aws-api-gateway-client').default;
import {AsyncStorage} from 'react-native';

export  async function getCognito() {
    const cognito = {
        accessKeyId: await AsyncStorage.getItem("accessKeyId"),
        secretAccessKey: await AsyncStorage.getItem("secretAccessKey"),
        sessionToken: await AsyncStorage.getItem("sessionToken"),
    };
    return cognito;
}
export default instanceApi = async () => {
    var test = getCognito().then(cognito => {
        console.log(cognito.accessKeyId);
        return apigClientFactory.newClient({
            accessKey: cognito.accessKeyId,
            invokeUrl: 'https://utj65gp237.execute-api.eu-west-1.amazonaws.com/Prod/',
            secretKey: cognito.secretAccessKey,
            sessionToken: cognito.sessionToken,
            region: 'eu-west-1',
            systemClockOffset: 0,
            retries: 4,
            retryCondition: (err) => {
                return err.response.status === 500;
            }
        });
    });
    return test;
}


export function getUser () {

    instanceApi().then(api => {
        api.invokeApi(null, 'user', 'GET')
            .then(function (result) {
                console.log(result);
            }).catch(function (error) {
                if (error.response.status === 404)
                    console.log('Unable to get the organization. We\'re investigating the issue.');
                else if (error.response.status === 505)
                    console.log('Unable to get the organization. We\'re investigating the issue.');
            })
    })
   }
