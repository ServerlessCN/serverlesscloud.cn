import * as React from 'react'
import {
  Text,
  Container,
  Box,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
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
    answer: '目前已支持 REST API、静态网站、Express.js Web 应用、Koa Web 应用等场景，更多实际应用场景在持续建设中。'
  }, {
    question: 'Serverless Framework 具有什么能力？',
    answer: 'Serverless Framework 具有资源编排、自动伸缩、事件驱动等能力，能够覆盖编码-调试-测试-部署等全生命周期。' 

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
    <Box className="scf-home-about">
    <Container
    width={[1, 1, 1, 912, 0.76, 1200]}
      px={0}>
      <Box className="scf-box">
        <Box className="scf-box__header">
          <Box className="scf-box__header-title">
            <h3>关于 Serverless Framework</h3>
          </Box>
          <Box className="scf-box__header-more">
            <Link to="/forum">
              常见问题 &gt;
            </Link>
          </Box>
        </Box>

        <Box className="scf-box__body">
              <Box className="scf-grid">
                {questions
                  .slice(0, 2)
                  .map(({question, answer}) => (
                    <Box className="scf-grid__item-12" key={question}>
                      <Box className="scf-grid__box">
                        <Box className="scf-home-about-item">
                          <Box className="scf-italic-title">
                            <h4 className="scf-italic-title__title">{question}</h4>
                          </Box>
                          <p className="scf-home-about-item__intro">{answer}</p>
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </Box>
              <Box className="scf-grid">
                {questions
                  .slice(2, 4)
                  .map(({question, answer}) => (
                    <Box className="scf-grid__item-12">
                      <Box className="scf-grid__box">
                        <Box className="scf-home-about-item">
                          <Box className="scf-italic-title">
                            <h4 className="scf-italic-title__title">{question}</h4>
                          </Box>
                          <p className="scf-home-about-item__intro">{answer}</p>
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Box>
      </Box>
    </Container>
    </Box>
  )
}