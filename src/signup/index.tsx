import React from 'react';

import {
    Form,
    Input,
    Button,
    Row,
    Col
} from 'antd';

class Signup extends React.Component {
    constructor(props: any) {
        super(props)
    }

    onFinish(values: any) {
        console.log('Success:', values);
    }

    onFinishFailed(values: any) {
        console.log('Failed:', values);
    }

    render() {
        return (
            <Form
                name="basic"
                initialValues={{ remember: true }}
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
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input placeholder="输入邮箱，作为登陆账号" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Row>
                        <Col span={20}>
                            <Form.Item
                                name="captcha"
                                noStyle
                                rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col offset={1} span={3}>
                            <Button block>Get</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Signup;