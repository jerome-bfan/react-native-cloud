import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import awsmobile from '../aws-exports';
import Amplify,{API} from 'aws-amplify';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import {AsyncStorage} from 'react-native';
import {getUser} from './Api';

const apigClientFactory = require('aws-api-gateway-client').default;


const poolData = {
    UserPoolId: awsmobile.aws_user_pools_id, // Your user pool id here
    ClientId: awsmobile.aws_user_pools_web_client_id, // Your client id here
    region: 'eu-west-1'
  };

export function authentification (form) {
    var username = "jaydde";
    var authenticationData = {
        Username: username,
        Password: "Mind72018"
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var userPool = new CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);
    console.log(cognitoUser);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) { 
            console.log(result);
            AWS.config.update({region: "eu-west-1"});

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: awsmobile.aws_cognito_identity_pool_id,
                Logins: {
                    'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_T6YnwqOUq': result.getIdToken().getJwtToken()
                }
            });

            AWS.config. credentials.get(function () {
                AsyncStorage.setItem('identityId', AWS.config.credentials.identityId);
                AsyncStorage.setItem('accessKeyId', AWS.config.credentials.accessKeyId);
                AsyncStorage.setItem('secretAccessKey', AWS.config.credentials.secretAccessKey);
                AsyncStorage.setItem('sessionToken', AWS.config.credentials.sessionToken);

              getUser(); 
                });            
            },

        onFailure: function (err) {
            console.error(err);
        }
    });
}

export function register(form) {

    var userPool = new CognitoUserPool(poolData);
    var email =  form.registerEmail.value;
    var username = form.registerUserName.value;
    var phone = form.registerPhone.value;
    console.log(phone);
    var password = form.registerPassword.value;
    var preferedusername = 'yaz666'
    var name = 'youyou'

    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: email
    };

    var dataPhoneNumber = {
        Name: 'phone_number',
        Value: phone
    };
    var dataUserNamePref = {
        Name: 'preferred_username',
        value: preferedusername
    };
    var dataName = {
        Name: 'name',
        value: name
    }
    var attributeEmail = new CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    var attributePreferedUsername = new CognitoUserAttribute(dataUserNamePref)
    var attributeName = new CognitoUserAttribute(dataName)

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    attributeList.push(attributePreferedUsername)
    attributeList.push(attributeName)

    console.log(`Register User ${username} ${phone} ${email}`);
    userPool.signUp(username, password, attributeList, null, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            var cognitoUser = result.user;
            console.log('user registered as ' + cognitoUser.getUsername());
        }
    });
}