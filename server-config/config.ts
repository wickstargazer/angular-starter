export const config = {
    baseUrl : 'http://localhost:3000',
    issuer: 'https://id.server.com',
    authorization_endpoint: 'https://id.server.com/connect/authorize',
    token_endpoint: 'https://id.server.com/connect/token',
    userinfo_endpoint: 'https://id.server.com/connect/userinfo',
    jwks_uri: 'https://id.server.com/.well-known/openid-configuration/jwks',
    endsession_endpoint: 'https://id.server.com/account/logout',
    post_logout_redirect_uri: 'https://example.com',
    CLOCK_TOLERANCE: 25300,
    client_id: 'server-front-server',
    redirect_uri: 'http://localhost:4200/callback',
    scope: 'openid server-api offline_access',
    response_mode: 'form_post',
    response_type: 'code',
    cookiesDomain: 'localhost'
};
