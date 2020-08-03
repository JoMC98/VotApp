module.exports = {
    HTTPS: true,
    SERVER_HOST: '192.168.210.1',
    SERVER_HTTPS_PORT: 443,
    SERVER_HTTP_PORT: 80,
    SERVER_API_PORT: 4300,

    SERVER_CERTIFICATE: './.config/.server.crt',
    SERVER_KEY: './.config/.server.key',

    DB_HOST: "localhost",
    DB_USER: 'root',
    DB_PASSWORD: 'TFG2020patata_',
    DB_DATABASE: 'VotApp',

    JWT_PRIVATE_KEY: './.config/.jwt.priv',
    JWT_PUBLIC_KEY: './.config/.jwt.pub',
    JWT_ALGHORITHM: 'RS256',
    JWT_MAX_TIME_ADMIN: '1d',
    JWT_MAX_TIME_VOTANTE: '20h',
    JWT_MAX_TIME_SOCKETS: '5m',

    MAIL_USERNAME: 'votapp.noreply@gmail.com',
    MAIL_PASSWORD: 'TFG2020patata_',
    TEMPLATE_NEW_USER: 'assets/newUserTemplate.html',
    TEMPLATE_CHANGE_PASSWD: 'assets/changePasswdTemplate.html',
    MAIL_ATACHMENTS: 
    [{
        filename: 'iconMail.ico',
        path: 'assets/iconMail.ico',
        cid: 'votappLogo'
    }, {
        filename: 'divider.png',
        path: 'assets/divider.png',
        cid: 'votappDivider'
    }],
    OPENVPN_MAIL_ATACHMENTS:
    [{
        filename: 'votapp.zip',
        path: 'votapp.zip',
        cid: 'votappFiles'
    }],

    VAPID_PRIVATE_KEY: './.config/.vapid.priv',
    VAPID_PUBLIC_KEY: './.config/.vapid.pub',
    VAPID_MAIL_TO: 'mailto:votapp.noreply@gmail.com',
    PUSH_NOTIFICATION_ID: 'votappDATA',

    MIN_PORT_SOCKET: 4301,
    MAX_PORT_SOCKET: 4400,
    INITIAL_FREE_PORTS: 100
};