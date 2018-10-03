Conclusion
==========

In this thesis we showed a new framework, that can be used to perform
web data integration tasks, and that was born from a previous project
also built by the candidate.

The main purpose of the framework is to leverage reuse and the
open-source community, so to reduce the number of prototypal and
short-term solutions that are still widely used to tackle this sort of
problems.

The main characteristics of the framework are the use of JSX components as
building blocks, i.e. resource-processing functions that can be defined
in an XML-like fashion, and the use of a multi-layer approach, where
multiple web middlewares can be composed together, so to maximize reuse
and separation of concerns.

We showed how these characteristics are what really distinguishes the
framework from other existing solutions, with the JSX approach being the
most prominent one.

The technical documentation gave a low-level description of the
framework, by showing how JSX components are evaluated and how the
multi-layer approach is made possible; moreover, it also contained the
description regarding the behavior and interface of the core components,
which can be used for tasks such as flow control, data conversion and
networking.

In the Case Study, we used the framework to build a practical
application that searches news articles from multiple heterogeneous
sources: APIs, static HTML pages, and HTML pages with
JavaScript-generated content.

The application was built using the multiple layers prescribed by the
framework, thus it can be easily extended for using new sources.

Future improvements
===================

Future iterations of the framework are expected to add support for a
wide variety of improvements, here follows a list of the most important
ones:

-   **Web service / Web application:**<br />
    The original SLR tool included a Web App to which multiple SLR tools
    could connect remotely via web socket. Users could then login to the
    web app to create and execute searches remotely via the attached SLR
    tools.<br />
    Future versions of webmiddle could extend this approach by offering
    a web layer, which could even be restricted to the lowest “site
    webmiddle” level; remember that services can be attached to a
    webmiddle by specifying a path, thus one could easily create a REST
    API where url paths map to service paths, so to execute these
    services remotely.

-   **Limit number of requests** in a given amount of time.<br />
    This is especially useful for not exceeding API requests and
    bandwidth limits.

-   **Proxy support**: how and when to use proxy servers.

-   **Authentication:** HTTP and OAuth.

-   **Redirects management**: how and when to perform HTTP redirects.

-   **Advanced logging**: different log levels, log to file, etc.

-   **Form submission**: to more easily navigate HTML pages.

-   **Access to queried server headers **

-   **Retry delays and timeouts**
