/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || '';
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('logo.svg')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('introduction/getting-started.html', language)}>Get started</Button>
            <Button href="#try">Try It Out</Button>
            <Button href={siteConfig.repoUrl}>GitHub</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = () => (
  <Block layout="twoColumn">
    {[
      {
        content: 'The building block of any webmiddle application is the JSX component.',
        image: imgUrl('component.png'),
        imageAlign: 'top',
        title: 'JSX Components',
      },
      {
        content: 'Evaluate and debug your components, inspect the call state and view the created resources.',
        image: 'https://github.com/webmiddle/webmiddle-devtools/blob/master/screenshots/home.png?raw=true',
        imageAlign: 'top',
        title: 'Webmiddle Devtools',
      },
    ]}
  </Block>
);

const FeatureCallout = () => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{textAlign: 'center'}}>
    <h2>Features</h2>
    <ul>
      <li>JSX components</li>
      <li>Concurrency</li>
      <li>Puppeteer</li>
      <li>Transformations from HTML, XML and JSON</li>
      <li>Caching</li>
      <li>Error handling</li>
      <li>Devtools</li>
      <li>Remote execution</li>
      <li>Full extensibility</li>
    </ul>
{/*    <MarkdownBlock>
    </MarkdownBlock>*/}
  </div>
);

const LearnHow = () => (
  <Block background="light" layout="threeColumn">
    {[
      {
        title: 'Batteries Included',
        content: 'The framework provides a set of core components for the most common operations like http requests, data transformations, flow control, Puppeteer requests, concurrency and error handling.',
      },
      {
        title: 'Extensible',
        content: `There is no actual difference between a core component and a component that you may want to develop yourself.

Anyone can contribute by adding new components!`
      },
      {
        title: "Remote execution",
        content: `Quickly turn webmiddle applications into REST APIs, allowing remote access via HTTP or WebSocket.

Use webmiddle-devtools for running and debugging your components and test them remotely.
`
      }
    ]}
  </Block>
);

const TryOut = () => (
  <div
    id="try"
    className="productShowcaseSection paddingBottom"
    style={{textAlign: 'center'}}>
    <h2>Try it Out</h2>
    <div dangerouslySetInnerHTML={{__html: `      
<iframe style="height: 80vh; border-bottom: 3px solid #F4F4F4;" width="100%" src="https://repl.it/@Maluen/webmiddle-try-it-out?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
    `}}/>
  </div>
);

const Description = () => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('logo.svg'),
        imageAlign: 'right',
        title: 'Description',
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }

  const showcase = siteConfig.users.filter(user => user.pinned).map(user => (
    <a href={user.infoLink} key={user.infoLink}>
      <img src={user.image} alt={user.caption} title={user.caption} />
    </a>
  ));

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>Who is Using This?</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          {/*<FeatureCallout />*/}
          <LearnHow />
          <TryOut />
          {/*<Description />*/}
          <Showcase language={language} />
        </div>
      </div>
    );
  }
}

module.exports = Index;
