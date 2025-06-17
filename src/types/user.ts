/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number;
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
export interface FilterUsersArgs {
    page: number;
    limit: number;
    group?: string;
    isRealname?: boolean;
    status?: number;
    keyword?: string;
}

export interface UpdateNodeArgs {
    id: number;
    name: string;
    hostname: string;
    ip: string;
    description: string;
    token: string;
    port: number;
    adminPort: number;
    adminPass: string;
    group: string;
    allowPort: string;
    allowType: string;
    need_realname: boolean;
    bandWidth: number;
    location: string;
}

export interface GetNodesArgs {
    page: number;
    limit: number;
    isOnline?: boolean;
    isDisabled?: boolean;
    keyword?: string;
}

export interface Node {
    port: number
    nodeId: number;
    name: string;
    hostname: string;
    description: string;
    token: string;
    servicePort: number;
    adminPort: number;
    adminPass: string;
    allowGroup: string;
    allowPort: string;
    allowType: string;
    isDisabled: boolean;
    isOnline: boolean;
    ip: string;
    need_realname: boolean;
    bandWidth: number;
    location: string;
    id: number;
}
export interface Group {
    id: number
    name: string
    friendlyName: string
    point: number
    proxies: number
    traffic: number
    out_limit: number
    in_limit: number
}

export interface Download {
    id: number
    name: string
    path: string
    arch: string
    version: string
    os: string
    desc: string
}



export interface TrafficType {
    todayUsedTraffic: number
    allUsedTraffic: number
    allTraffic: number
}

export interface TrafficData {
    date: string;
    inTraffic: number;
    outTraffic: number;
    userId: number;
}