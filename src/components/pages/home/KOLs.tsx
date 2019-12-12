import * as React from 'react'
import {
  Button,
  Box,
  Container,
  Row,
  Background,
  Center,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import { MainTitle } from '@src/components/pages/home/Title'
import { Link } from 'gatsby'

import imgTwitter from '@src/assets/images/twitter-icon.svg'
import imgTweeterOne from '@src/assets/images/papa.png'
import imgTweeterTwo from '@src/assets/images/david.png'
import imgTweeterThree from '@src/assets/images/jason.png'
import imgTweeterFour from '@src/assets/images/tyler.png'
import './KOLs.css'

interface KOL {
  name: string
  avatar: any
  speak: string
}

const kols: KOL[] = [
  {
    name: 'david_welch',
    speak: `Built our platform on @goserverless with 2 engineers working
  nights and mornings for the first 14 months. Didn’t pay a dime
  until 16 months in, have scaled to 10+ employees w exp from 0
  to senior, very agile w CI/CD, couldn’t have made a better
  choice.`,
    avatar: imgTweeterTwo,
  },
  {
    name: 'DrPappa',
    speak: `I didn't realise #serverless was so absurdly quick and easy to
    use. Thanks @goserverless you've done an excellent job.`,
    avatar: imgTweeterOne,
  },
  {
    name: 'themccallister',
    speak: `I’m still a huge fan of @Docker but man this @goserverless
    stuff is purely amazing, I'm fully onboard with managing
    infrastructure from code... Just moved an existing API and
    supporting app to Cloud functions in one day...`,
    avatar: imgTweeterThree,
  },
  {
    name: 'TylerZey',
    speak: `Built two Cloud functions today via @goserverless. One runs
    daily to update all of our coupons in DynamoDB. And the other
    is the query function to search DynamoDB for the coupon. Super
    duper easy with Serverless framework. Got it live and almost
    in prod already.`,
    avatar: imgTweeterFour,
  },
]

function Kol({ kol }: { kol: KOL }) {
  return (
    <div className="user-tweets-tweet">
      <div className="user-tweets-tweet-icon">
        <img alt={`${kol.name}_twitter`} src={imgTwitter} />
      </div>
      <div className="user-tweets-tweet-name">
        <img alt={kol.name} src={kol.avatar} />@{kol.name}
      </div>
      <div className="user-tweets-tweet-text">{kol.speak}</div>
    </div>
  )
}

function KOLs() {
  return (
    <Container maxWidth={['100%', '100%', '100%', '90%', '85%']}>
      <div className="container user-tweets-component">
        <div className="container-inner user-tweets-inner">
          <div className="container user-tweets-tweets">
            <Row justifyContent="space-around" flexWrap="wrap">
              {kols.map(kol => (
                <Kol key={kol.name} kol={kol} />
              ))}
            </Row>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default function() {
  return (
    <Background
      pt={'40px'}
      pb={'40px'}
      width={1}
      background={theme.colors.gray[0]}
    >
      <Center flexDirection="column">
        <MainTitle>Serverless 中文技术社区</MainTitle>

        <Box mt="30px" mb="30px">
          <Link to="/about">
            <Button width="160px" p="0.4rem" fontSize="18px" theme={theme}>
              立即加入
            </Button>
          </Link>
        </Box>
        <Box mt="30px" mb="30px">
          <KOLs />
        </Box>
      </Center>
    </Background>
  )
}
