import React from 'react';
import axios from "axios";

import * as qs from 'querystring';

import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Alert
} from 'antd';

const ENDPOINT = "http://58b5dd3da8514f30a8dfbf42bb0a740c-cn-beijing.alicloudapi.com";
const send_email_code_url = `${ENDPOINT}/send-email-code`;
const signup_url = `${ENDPOINT}/signup`;

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
}

type Props = {};
type State = {
    email_property: string,
    token_property: string,
    error_property: boolean,
    is_waiting_for_code: boolean,
    code_time_count: number,
    timer: any
};

class Signup extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            email_property: '',
            token_property: '',
            error_property: false,
            is_waiting_for_code: false,
            code_time_count: 0,
            timer: null
        };
    }

    send_email_code = async () => {
        if (!this.state.timer) {
            this.setState({
                code_time_count: 60,
                is_waiting_for_code: true,
                timer: setInterval(() => {
                    if (this.state.code_time_count > 0) {
                        this.setState({
                            code_time_count: this.state.code_time_count - 1
                        })
                    } else {
                        clearInterval(this.state.timer);
                        this.setState({
                            is_waiting_for_code: false,
                            timer: null
                        })
                    }
                }, 1000)
            })
        }

        const body = qs.stringify({
            'email': this.state.email_property,
        })
        const resp = await axios.post(send_email_code_url, body, { headers })
        this.setState({ token_property: resp.data.token })
    }

    onEmailChange = (e: any) => {
        this.setState({ email_property: e.target.value })
    }

    onFinish = async (values: any) => {
        const body = qs.stringify(values)
        const signup_headers = {
            ...headers,
            'X-Token': this.state.token_property
        }

        try {
            const resp = await axios.post(signup_url, body, { headers: signup_headers });
            localStorage.setItem("token", resp.data.token);
        } catch (error) {
            this.setState({ error_property: true })
            console.log(error)
        }
    }

    onFinishFailed(values: any) {
        console.log('Failed:', values);
    }

    render() {
        return (
            <div>
                {this.state.error_property ? <div><Alert message="验证码错误" type="error" showIcon /><br /></div> : null}
                <Form
                    name="basic"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: '邮箱格式错误，请检查',
                            },
                            {
                                required: true,
                                message: '邮箱不能为空',
                            },
                        ]}
                    >
                        <Input size="large" onChange={this.onEmailChange} placeholder="输入邮箱，作为登陆账号" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '密码不能为空' }]}
                    >
                        <Input.Password size="large" placeholder="输入账号密码" />
                    </Form.Item>

                    <Form.Item>
                        <Row>
                            <Col span={15}>
                                <Form.Item
                                    name="code"
                                    noStyle
                                    rules={[{ required: true, message: '验证码不能为空' }]}
                                >
                                    <Input size="large" placeholder="输入邮件验证码" />
                                </Form.Item>
                            </Col>
                            <Col offset={1} span={8}>
                                <Button onClick={this.send_email_code} disabled={this.state.is_waiting_for_code} size="large" block>
                                    {this.state.is_waiting_for_code ? `${this.state.code_time_count}s` : "获取验证码"}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                    <br />

                    <Form.Item>
                        <Button type="primary" htmlType="submit" shape="round" size="large" block>
                            下一步
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        )
    }
}

export default Signup;