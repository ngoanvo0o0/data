module.exports = {
    apps: [{
      name: "GiaiTriNews_FE",
      instances: 1,
      autorestart: true,
      script: "npm",
      args: "run listen",
      env: {
        PORT: '8080',
      },
      watch: false
    }]
}
