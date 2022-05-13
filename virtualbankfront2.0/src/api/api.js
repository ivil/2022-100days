import instance from "./net";

// export const captcha = '/code/getGraphCode?imageId='
export const captcha = '/bank2/code/getGraphCode?imageId='

/**
 * 
 * @param {object} data 获取手机验证码 {mobilePhone:'',type:'ZC' //默认为空 ZC注册}
 * @returns 
 */
export async function getPhoneCode(data) {
    try {
        let result = await instance.get('/code/getPhoneCode', {
            params: data,
        })
        return result.data;
    } catch (e) {
        return e
    }
}
/**
 * 
 * @param {object} data 开户
 */
export async function openAccSubmit(data) {
    try {
        let result = await instance.post('/account/openAccount', data)
        return result.data;
    } catch (e) {
        return e
    }
}
/**
 * 
 * @param {object} data 绑卡
 * @returns promise对象
 */
export async function bindCardSubmit(data) {
    try {
        let result = await instance.post('/account/bindCard', data);
        return result.data
    } catch (e) {
        return e
    }
}

/**
 * 
 * @param {object} data 绑卡发送短信验证码验证
 * @returns promise对象
 */
export async function bindCardCode(data) {
    try {
        let result = await instance.get('/code/getBindPhoneCode', {
            params: {
                mobilePhone: data,
            }
        });
        return result.data
    } catch (e) {
        return e
    }
}

/**
 * 
 * @param {string} data 余额查询
 * @returns promise对象
 */
export async function balanceQuery(data) {
    try {
        let result = await instance.get("/account/balanceQuery", {
            params: {
                accountId: data,
            }
        });
        return result.data;
    } catch (e) {
        return e;
    }
}
/**
 * 
 * @returns 查询银行卡列表
 */
export async function getAccountList() {
    try {
        let result = await instance.get("/account/getAccountList", {
            params: {
                userId: JSON.parse(sessionStorage.getItem("user")).id,
            }
        });
        return result.data;
    } catch (e) {
        return e;
    }
}


/**
 * 
 * @param {object} data 充值
 * @returns 
 */
export async function recharge(data) {
    try {
        let result = await instance.post("/account/recharge", data);
        return result.data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {object} data 提现
 * @returns 
 */
export async function withdraw(data) {
    try {
        let result = await instance.post("/account/withdraw", data);
        return result.data;
    } catch (e) {
        console.log(e);
    }
}


/**
 * 
 * @param {object} data 转账
 * @returns 
 */
export async function transfer(data) {
    try {
        let result = await instance.post("/account/transfer", data);
        return result.data;
    } catch (e) {
        console.log(e);
    }
}
/**
 * 
 * @param {string} data 交易记录
 * @returns 
 */
export async function record() {
    try {
        let result = await instance.get("/record/list", {
            params: {
                userId: JSON.parse(sessionStorage.getItem("user")).id,
            }
        });
        return result.data;
    } catch (e) {
        return e;
    }
}
/**
 * 
 * @param {string} data 查某一天交易记录
 */
export async function getSpecificRecord(data) {
    try {
        let result = await instance.get("/record/timeList", {
            params: {
                userId: JSON.parse(sessionStorage.getItem("user")).id,
                time: data
            }
        });
        return result.data;
    } catch (e) {
        return e;
    }
}
/**
 * 
 * @param {string} data 交易记录详情
 */
export async function getRecordDetail(data) {
    try {
        let result = await instance.get("/record/detail", {
            params: {
                id: data
            }
        });
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {object} data 注册发送短信验证码验证
 * @returns promise对象
 */
export async function getRegisterCode(data) {
    try {
        let result = await instance.get('/code/validatePhoneCode', {
            params: data
        });
        return result.data
    } catch (e) {
        return e
    }
}
/**
 * 
 * @param {object} data 注册
 * @returns 
 */
export async function register(data) {
    try {
        let result = await instance.post("/user/register", data);
        return result.data;
    } catch (e) {
        return e;
    }
}
/**
 * 
 * @param {object} data 密码登录
 * @returns 
 */
export async function login(data) {
    try {
        console.log(data);
        let result = await instance.post("/user/login", data);
        return result.data;
    } catch (e) {
        return e;
    }
}
/**
 * 
 * @param {object} data 手机号登录
 * @returns 
 */
export async function sign(data) {
    try {
        let result = await instance.post("/user/loginByPhone", data);
        return result.data;
    } catch (e) {
        return e;
    }
}
/**
 * 
 * @param {object} data 忘记密码
 * @returns 
 */
export async function forgetPass(data) {
    try {
        let result = await instance.post("/user/forgetPassword", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {object} data 理财产品列表
 * @returns 
 */
export async function getFinanceList(data) {
    try {
        let result = await instance.post("/finance/list", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {object} data 积分抽奖
 * @returns 
 */
export async function luckDraw(data) {
    try {
        let result = await instance.post("/production/lottery", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {object} data 积分签到
 * @returns 
 */
export async function signIn() {
    try {
        let result = await instance.get("/user/sign", {
            params: {
                userId: JSON.parse(sessionStorage.getItem("user")).id,
            }
        });
        return result.data;
    } catch (e) {
        return e;
    }
}


/** 
 * @param {object} data 申购
 * @returns 
 */
export async function buyFinance(data) {
    try {
        let result = await instance.post("/finance/buy", data);
        return result.data;
    } catch (e) {
        return e;
    }
}


/** 
 * @param {object} data 赎回
 * @returns 
 */
export async function backFinance(data) {
    try {
        let result = await instance.post("/finance/sale", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/** 
 * @param {object} data 赎回历史记录
 * @returns 
 */
export async function backFinanceList(type) {
    try {
        let result = await instance.get("/recordFinance/financeOptionList", {
            params: {
                userId: JSON.parse(sessionStorage.getItem("user")).id,
                type: type
            },
        });
        return result.data;
    } catch (e) {
        return e;
    }
}


/**
 * 
 * @param {object} data 持仓历史记录
 * @returns 
 */
export async function hodeFinance(type) {
    try {
        let result = await instance.get('/recordFinance/list', {
            params: {
                userId: JSON.parse(sessionStorage.getItem("user")).id,
                type: type
            },
        })
        return result.data;
    } catch (e) {
        return e
    }
}

/**
 * 
 * @param {object} data 积分商城商品列表
 * @returns 
 */
export async function getGoods() {
    try {
        let result = await instance.get("/production/list");
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {object} data 兑换商品
 * @returns 
 */
export async function exchange(data) {
    try {
        let result = await instance.get("/production/exchange", {
            params: data
        });
        return result.data;
    } catch (e) {
        return e;
    }
}

/** 
 * @param {object} data 修改登录密码
 * @returns 
 */
export async function upSignPass(data) {
    try {
        let result = await instance.post("/user/upPassword", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/** 
 * @param {object} data 修改支付密码
 * @returns 
 */
export async function upPayPass(data) {
    try {
        let result = await instance.post("/user/upPayPassword", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/** 
 * @param {object} data 修改手机号
 * @returns 
 */
export async function upPhone(data) {
    try {
        let result = await instance.post("/user/upMobilePhone", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/** 
 * @param {object} data 注销用户
 * @returns 
 */
export async function cancellation(data) {
    try {
        let result = await instance.post("/user/writeOffUser", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/** 
 * @param {object} data 解绑卡
 * @returns 
 */
export async function relieveCard(data) {
    try {
        let result = await instance.post("/account/relieveCardById", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * @param {object} data 插入与用户有关的亲朋好友的账户信息
 * @returns 
 */
export async function insertUserFriends(data) {
    try {
        let result = await instance.post("/user/insertUserFriends", data);
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * @param {object} data 查询与用户有关的亲朋好友的账户信息
 * @returns 
 */
export async function selectUserFriends() {
    try {
        let result = await instance.get("/user/selectUserFriends", {
            params: { userId: JSON.parse(sessionStorage.getItem("user")).id },
        });
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * @param {object} data 查询七日利率变化
 * @returns 
 */
export async function getRateList(data) {
    try {
        let result = await instance.get("/finance/rateList", {
            params: { financeId: data },
        });
        return result.data;
    } catch (e) {
        return e;
    }
}
/**
 * 
 * @param {Number} data 根据银行卡号查预留手机号
 * @returns 
 */
export async function getAdvancePhone(data) {
    try {
        let result = await instance.get("/account/getPhone", {
            params: {
                accountId: data
            },
        });
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {String}  查询用户个人信息
 * @returns 
 */
export async function getUserInfo() {
    try {
        let result = await instance.get("/user/info", {
            params: {
                userId: JSON.parse(sessionStorage.getItem('user')).id
            },
        });
        return result.data;
    } catch (e) {
        return e;
    }
}

/**
 * 
 * @param {String}  根据银行卡号查开户行
 * @returns 
 */
 export async function getBankName(data) {
    try {
        let result = await instance.get("/account/bankName", {
            params: {
                accountId: data
            },
        });
        return result.data;
    } catch (e) {
        return e;
    }
}