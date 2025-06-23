/**
 * 用户信息接口
 */
export interface UserInfo {
    id: number;
    balance?: string;
    freezeBalance?: string; 
    username: string;
    usertype?: number;
    sex?: number;
    profession?: string;
    signature?: string;
    companyname?: string;
    groupid?: number;
    email?: string;
    wechat_id?: string | null;
    country?: string;
    province?: string;
    city?: string;
    region?: string;
    address1?: string;
    postcode?: string;
    phonenumber?: string;
    currency?: number;
    defaultgateway?: string;
    credit?: string;
    billingcid?: number;
    cardtype?: string;
    cardlastfour?: string;
    host?: string;
    language?: string;
    emailoptout?: number;
    marketing_emails_opt_in?: number;
    overrideautoclose?: number;
    allow_sso?: number;
    know_us?: string | null;
    is_login_sms_reminder?: number;
    create_time?: number;
    sale_id?: number;
    qq?: string;
    api_password?: string;
    second_verify?: number;
    status?: number;
    email_remind?: number;
    is_open_credit_limit?: number;
    api_open?: number;
    send_close?: number;
    is_password?: number;
    certifi?: Certification;
}

export interface Certification {
    name: string;
    status: number;
    auth_fail: string;
    type: string;
}