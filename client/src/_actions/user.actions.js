import { userConstants } from '../_constants';
import { transactionService, userService} from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete,
    getBalance,
    reset,
    update, 
    confirm,
    checkConfirmation
};

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                () => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );    
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                () => { 
                    dispatch(success(id));
                },
                error => {
                    dispatch(failure(id, error));
                }
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}

function getBalance(user) {
    return dispatch => {
        dispatch(request(user));

        userService.getBalance(user)
            .then(
                balance => {
                    dispatch(success(balance));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.BALANCE_REQUEST, user } }
    function success(balance) { return { type: userConstants.BALANCE_SUCCESS, balance  } }
    function failure(user, error) { return { type: userConstants.BALANCE_FAILURE, user, error}}
}

function reset(user) {
    return dispatch => {
        dispatch(request(user));

        userService.reset(user)
            .then(
                balance => {
                    dispatch(success(user));
                    dispatch(alertActions.success('Email to: ' + user.email + ' with passowrd send.'))
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(user, error) {return { type: userConstants.REGISTER_FAILURE, user, error} } 
}

function update(user) {
    return dispatch => {
        dispatch(request(user));

        userService.update(user)
            .then(
                user => {
                    dispatch(success(user));
                    dispatch(alertActions.success('Password Updated'))
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }
    
    function request(user) { return { type: userConstants.UPDATE_REQUEST, user } }
    function success(user) { return { type: userConstants.UPDATE_SUCCESS, user } }
    function failure(user, error) {
        return {
            type: userConstants.UPDATE_FAILURE,
            user,
            error
        }
    }
}

function confirm(user) {
    return dispatch => {
        dispatch(request(user));

        userService.sendVerificationCode(user.email)
            .then(
                user => {
                    dispatch(success(user));
                    dispatch(alertActions.success('Verification message send'))
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                });        
    }

    function request(user) { return { type: userConstants.CONFIRM_REQUEST, user }}
    function success(user) { return { type: userConstants.CONFIRM_SUCCESS, user } }
    function failure(user, error) {return {type: userConstants.CONFIRM_FAILURE, user, error}}
}

function checkConfirmation(code, userid) {
    return dispatch => {
        dispatch(request(code, userid));

        userService.verifyCodeForUser(code, userid)
            .then(
                user => {                    
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    }
    function request(code, userid) { return { type: userConstants.CHECK_REQUEST, code, userid } }
    function success(user) { return { type: userConstants.CHECK_SUCCESS, user } }
    function failure(user, error) { return { type: userConstants.CHECK_FAILURE, user, error } }
}