module.exports = {
    SERVER_HOST: 'localhost',
    SERVER_PORT: 4400,
    // SERVER_HOST: '150.128.97.91',
    // SERVER_PORT: 4300,

    SERVER_CERTIFICATE: './.config/.server.cert',
    SERVER_KEY: './.config/.server.key',

    DB_HOST: "localhost",
    DB_USER: 'root',
    DB_PASSWORD: 'TFG2020patata_',
    DB_DATABASE: 'VotApp',

    // DB_HOST: "127.0.0.1",
    // DB_USER: 'al361869',
    // DB_PASSWORD: '',
    // DB_DATABASE: 'al361869',

    JWT_PRIVATE_KEY: './.config/.jwt.priv',
    JWT_PUBLIC_KEY: './.config/.jwt.pub',
    JWT_ALGHORITHM: 'RS256',
    JWT_MAX_TIME_ADMIN: '1h',
    JWT_MAX_TIME_VOTANTE: '20m',
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

    VAPID_PRIVATE_KEY: './.config/.vapid.priv',
    VAPID_PUBLIC_KEY: './.config/.vapid.pub',
    VAPID_MAIL_TO: 'mailto:votapp.noreply@gmail.com',
    PUSH_NOTIFICATION_ID: 'votappDATA',

    MIN_PORT_SOCKET: 4301,
    MAX_PORT_SOCKET: 4400,
    INITIAL_FREE_PORTS: 100,
};