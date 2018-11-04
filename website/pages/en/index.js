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
  <Block layout="fourColumn">
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
  <Block background="light">
    {[
      {
        content: 'webmiddle is a JSX-driven Node.js framework for extracting, transforming and processing web data from multiple heterogeneous sources, using a multi-layer approach, where each web middleware, or webmiddle, abstracts one or more sources of data, so to produce a structured output with the format of your choice, that can be then consumed by the higher-level middleware. Each web middleware is implemented via JSX components, leading to a highly composable, extensible and declarative approach.',
        image: imgUrl('logo.svg'),
        imageAlign: 'top',
        title: 'What it is',
      },
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
      <iframe src="https://codesandbox.io/embed/qqxx7255zw?expanddevtools=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2Fservices%2FFetchPageLinks.js&previewwindow=tests" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
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
