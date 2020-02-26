import * as React from 'react'
import {
  Flex,
  Text,
  Container,
  Box,
  Background,
  Button,
  Row
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import {SubMainTitle} from '@src/components/pages/home/Title'
import styled from 'styled-components'
import {Link} from 'gatsby'
import './CommonQuestion.css'


const questions : {
  question : string;
  answer : string | JSX.Element
}[] = [
  {
    question: '什么是 Serverless Framework？',
    answer: 'Serverless Framework 是业界最受欢迎的无服务器应用框架，开发者无需关心底层资源即可部署完整可用的 serverless 应用架构。'
  }, {
    question: 'Serverless Framework 支持了哪些场景？',
    answer: '目前已支持 REST API 、静态网站、Express.js Web应用、Koa Web应用等场景 ，更多实际应用场景在持续建设中。'
  }, {
    question: 'Serverless Framework 具有什么能力？',
    answer: 'Serverless Framework 具有资源编排、自动伸缩、事件驱动等能力，覆盖编码-调试-测试-部署等全生命周期。帮助开发者通过联动云上上下游 serv' +
        'erless 服务，迅速构建应用。'
  }, {
    question: '在哪里可以交流 Serverless 技术？',
    answer: (
      <Link to="/about">
        <Text
          color={theme.colors.gray[2]}
          fontSize={['14px', '14px', '14px', '14px']}
          lineHeight="22px">
          点击这里加入「Serverless 技术粉丝群」进行交流，本站论坛亦将于近期上线，敬请期待。
        </Text>
      </Link>
    )
  }
]
export default function () {
  return (
    <Background pt={'40px'} pb={'40px'} width={1}>
    <div className="scf-common-question-bg">
      <Row
        className="scf-box__header"
        width="76%"
        height="100%"
        alignItems="flex-end"
        justifyContent="space-between"
        style={{
        margin: "10px auto"
      }}>
        <div className="scf-box__header-title">
          <h3>关于 Serverless Framework</h3>
        </div>
        <div className="scf-box__header-more">
          <Link to="/forum">
            常见问题 &gt;
          </Link>
        </div>
      </Row>

      <Container
        maxWidth={[
        1000,
        1216,
        1216,
        1216,
        '76%',
        1216
      ]}>
        <Flex flexWrap="wrap" justifyContent="center">
          <div className="scf-common-question-box__body">
           
          <div className="scf-grid">
              {questions.slice(0,2).map(({question, answer}) => (
                <div className="scf-grid__item-12">
                  <div className="scf-grid__box">
                    <div className="scf-home-about-item">
                      <div className="scf-italic-title">
                        <h4 className="scf-italic-title__title">{question}</h4>
                      </div>
                      <p className="scf-home-about-item__intro">{answer}</p>
                    </div>
                  </div>
                </div>
                ))}
                </div>
                <div className="scf-grid">
              {questions.slice(2,4).map(({question, answer}) => (
                <div className="scf-grid__item-12">
                  <div className="scf-grid__box">
                    <div className="scf-home-about-item">
                      <div className="scf-italic-title">
                        <h4 className="scf-italic-title__title">{question}</h4>
                      </div>
                      <p className="scf-home-about-item__intro">{answer}</p>
                    </div>
                  </div>
                </div>
                ))}
                </div>
          </div>
        </Flex>
      </Container>
      </div>
    </Background>
  )
}
