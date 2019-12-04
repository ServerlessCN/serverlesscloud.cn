import * as React from 'react'
import { Flex, Text, Container, Box, Background } from '@src/components/atoms'
import theme from '@src/constants/theme'
import { MainTitle, SubMainTitle } from '@src/components/pages/home/Title'
import styled from 'styled-components'
import { Link } from 'gatsby'

const TextWithCursor = styled(Text)`
  cursor: pointer;
  display: inline-block;
`

const questions: { question: string; answer: string | JSX.Element }[] = [
  {
    question: '什么是 Serverless Framework？',
    answer:
      'Serverless Framework 是业界最受欢迎的无服务器应用框架，开发者无需关心底层资源即可部署完整可用的 serverless 应用架构。',
  },
  {
    question: 'Serverless Framework 支持了哪些场景？',
    answer:
      '目前已支持 REST API 、静态网站、Express.js Web应用、Koa Web应用等场景 ，更多实际应用场景在持续建设中。',
  },
  {
    question: 'Serverless Framework 具有什么能力？',
    answer:
      'Serverless Framework 具有资源编排、自动伸缩、事件驱动等能力，覆盖编码-调试-测试-部署等全生命周期。帮助开发者通过联动云上上下游 serverless 服务，迅速构建应用。',
  },
  {
    question: '在哪里可以交流 Serverless 技术？',
    answer: (
      <Link to="/about">
        <Text
          color={theme.colors.gray[2]}
          fontSize={['14px', '14px', '14px', '14px']}
          lineHeight="22px"
        >
          点击这里加入【Serverless技术粉丝群】进行交流，本站论坛亦将于近期上线，敬请期待。
        </Text>
      </Link>
    ),
  },
]
export default function() {
  return (
    <Background pt={'40px'} pb={'40px'} width={1} backgroundColor="white">
      <Flex alignItems="center" justifyContent="center">
        <Link to="/doc/5">
          <MainTitle>常见问题</MainTitle>
        </Link>
      </Flex>

      <Container
        pt={'50px'}
        pb={'50px'}
        maxWidth={[1000, 1216, 1216, 1216, '76%', 1216]}
      >
        <Flex flexWrap="wrap" justifyContent="center">
          {questions.map(({ question, answer }) => (
            <Box key={question} p={'10px 50px'} width={[1, 1, 1, '50%', '50%']}>
              <Box pt={'10px'} pb={'10px'}>
                <SubMainTitle>{question}</SubMainTitle>
              </Box>
              <Box pt={'20px'} pb={'20px'}>
                <Text
                  color={theme.colors.gray[2]}
                  fontSize={['14px', '14px', '14px', '14px']}
                  lineHeight="22px"
                >
                  {answer}
                </Text>
              </Box>
            </Box>
          ))}
        </Flex>
      </Container>

      <Flex alignItems="center" justifyContent="center">
        <Text fontSize={'14px'}>
          <Link to="/about">联系我们</Link>
          {/* <Link to="/about">
            <TextWithCursor color={theme.colors.serverlessRed}>
              请联系我们
            </TextWithCursor>
          </Link> */}
        </Text>
      </Flex>
    </Background>
  )
}
