// // @ts-check
// ///<reference path="../global.d.ts" />

// import { isMobile } from "./utils";

// Cypress.Commands.add("login", (username, password, { rememberUser = false } = {}) => {
//   const signinPath = "/signin";
//   const log = Cypress.log({
//     name: "login",
//     displayName: "LOGIN",
//     message: [`🔐 Authenticating | ${username}`],
//     // @ts-ignore
//     autoEnd: false,
//   });

//   cy.intercept("POST", "/login").as("loginUser");
//   cy.intercept("GET", "checkAuth").as("getUserProfile");

//   cy.location("pathname", { log: false }).then((currentPath) => {
//     if (currentPath !== signinPath) {
//       cy.visit(signinPath);
//     }
//   });

//   log.snapshot("before");

//   cy.getBySel("signin-username").type(username);
//   cy.getBySel("signin-password").type(password);

//   if (rememberUser) {
//     cy.getBySel("signin-remember-me").find("input").check();
//   }

//   cy.getBySel("signin-submit").click();
//   cy.wait("@loginUser").then((loginUser: any) => {
//     log.set({
//       consoleProps() {
//         return {
//           username,
//           password,
//           rememberUser,
//           userId: loginUser.response.statusCode !== 401 && loginUser.response.body.user.id,
//         };
//       },
//     });

//     log.snapshot("after");
//     log.end();
//   });
// });

// Cypress.Commands.add("loginByApi", (username, password = Cypress.env("defaultPassword")) => {
//   return cy.request("POST", `${Cypress.env("apiUrl")}/login`, {
//     username,
//     password,
//   });
// });

// Cypress.Commands.add("loginByXstate", (username, password = Cypress.env("defaultPassword")) => {
//   const log = Cypress.log({
//     name: "loginbyxstate",
//     displayName: "LOGIN BY XSTATE",
//     message: [`🔐 Authenticating | ${username}`],
//     autoEnd: false,
//   });

//   cy.intercept("POST", "/login").as("loginUser");
//   cy.intercept("GET", "/checkAuth").as("getUserProfile");
//   cy.visit("/signin", { log: false }).then(() => {
//     log.snapshot("before");
//   });

//   cy.window({ log: false }).then((win) => win.authService.send("LOGIN", { username, password }));

//   cy.wait("@loginUser").then((loginUser) => {
//     log.set({
//       consoleProps() {
//         return {
//           username,
//           password,
//           // @ts-ignore
//           userId: loginUser.response.body.user.id,
//         };
//       },
//     });
//   });

//   return cy
//     .getBySel("list-skeleton")
//     .should("not.exist")
//     .then(() => {
//       log.snapshot("after");
//       log.end();
//     });
// });

// Cypress.Commands.add("logoutByXstate", () => {
//   const log = Cypress.log({
//     name: "logoutByXstate",
//     displayName: "LOGOUT BY XSTATE",
//     message: [`🔒 Logging out current user`],
//     // @ts-ignore
//     autoEnd: false,
//   });

//   cy.window({ log: false }).then((win) => {
//     log.snapshot("before");
//     win.authService.send("LOGOUT");
//   });

//   return cy
//     .location("pathname")
//     .should("equal", "/signin")
//     .then(() => {
//       log.snapshot("after");
//       log.end();
//     });
// });

// Cypress.Commands.add("switchUserByXstate", (username) => {
//   cy.logoutByXstate();
//   return cy.loginByXstate(username).then(() => {
//     if (isMobile()) {
//       cy.getBySel("sidenav-toggle").click();
//       cy.getBySel("sidenav-username").contains(username);
//       cy.getBySel("sidenav-toggle").click({ force: true });
//     } else {
//       cy.getBySel("sidenav-username").contains(username);
//     }
//     cy.getBySel("list-skeleton").should("not.exist");
//     cy.getBySelLike("transaction-item").should("have.length.greaterThan", 1);
//   });
// });

Cypress.Commands.add('loginUI', (username: string, password: string, status: number) => {
    cy.visit(Cypress.env('host'))
    cy.intercept('POST','**/login').as('login')
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('button[type="submit"]').click()
    cy.wait('@login').then(intReq => {
        expect(intReq.response?.statusCode).to.equal(status)
    })
});

Cypress.Commands.add('logoutUI', () => {

    const logout = () => {
        cy.intercept('POST','**/logout').as('logout')
        cy.get('[data-test="sidenav-signout"]').click()
        cy.wait('@logout')
        cy.url().should('include', '/signin')
        }
        
        // First make sure that the user is logged in
        let authState = JSON.parse(window.localStorage.getItem('authState'))
        expect(authState.value).to.equal('authorized')

        cy.get('[data-test="sidenav-signout"]').then(($btn) => {
            if ($btn.is(':visible')) {
                logout();
            }
            else {
                cy.get('[data-test="drawer-icon"]').click()
                logout();
            }
        })
})


Cypress.Commands.add('loginAPI', (username: string, password: string, status: number) => {
    cy.request({
        method: 'POST',
        url: Cypress.env('api'),
        body: {
            password: password,
            type: 'LOGIN',
            username: username
        }
    }).then(res => {
        expect(res.status).to.eq(status)
    })
})

