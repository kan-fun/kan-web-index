import React from 'react';
import axios from "axios";

import * as qs from 'querystring';

import {
    Form,
    Input,
    Button,
    Row,
    Col
} from 'antd';

const ENDPOINT = "http://58b5dd3da8514f30a8dfbf42bb0a740c-cn-beijing.alicloudapi.com";
const send_email_code_url = `${ENDPOINT}/send-email-code`;
const signup_url = `${ENDPOINT}/signup`;

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
}

type Props = {};
type State = { email_property: string, token_property: string };

class Signup extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = { email_property: '', token_property: '' };
    }

    send_email_code = async () => {
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
        const resp = await axios.post(signup_url, body, { headers: signup_headers })
        localStorage.setItem("token", resp.data.token);
    }

    onFinishFailed(values: any) {
        console.log('Failed:', values);
    }

    render() {
        return (
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
                    <Input onChange={this.onEmailChange} placeholder="输入邮箱，作为登陆账号" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '密码不能为空' }]}
                >
                    <Input.Password placeholder="输入账号密码" />
                </Form.Item>

                <Form.Item>
                    <Row>
                        <Col span={20}>
                            <Form.Item
                                name="code"
                                noStyle
                                rules={[{ required: true, message: '验证码不能为空' }]}
                            >
                                <Input placeholder="输入邮件验证码" />
                            </Form.Item>
                        </Col>
                        <Col offset={1} span={3}>
                            <Button onClick={this.send_email_code} block>获取验证码</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        下一步
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Signup;