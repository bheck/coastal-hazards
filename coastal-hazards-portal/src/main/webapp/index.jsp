<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="gov.usgs.cida.config.DynamicReadOnlyProperties"%>
<%@page import="org.slf4j.Logger"%>
<%@page import="org.slf4j.LoggerFactory"%>

<!DOCTYPE html>

<%!	protected DynamicReadOnlyProperties props = new DynamicReadOnlyProperties();

	{
		try {
			props = props.addJNDIContexts(new String[0]);
		} catch (Exception e) {
			LoggerFactory.getLogger("index.jsp").error("Could not find JNDI - Application will probably not function correctly");
		}
	}
	boolean development = Boolean.parseBoolean(props.getProperty("development"));
%>

<html lang="en">
    <head>
        <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE" />
        <META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE" />
        <META HTTP-EQUIV="EXPIRES" CONTENT="0" />
        <META HTTP-EQUIV="CONTENT-LANGUAGE" CONTENT="en-US" />
        <META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=UTF-8" />
        <META NAME="viewport" CONTENT="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
        <!--[if lt IE 9]>
        <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        <jsp:include page="template/USGSHead.jsp">
            <jsp:param name="relPath" value="" />
            <jsp:param name="shortName" value="USGS Coastal Hazards Portal" />
            <jsp:param name="title" value="USGS Coastal Change Hazards" />
            <jsp:param name="description" value="" />
            <jsp:param name="author" value="Ivan Suftin, Tom Kunicki, Jordan Walker, Jordan Read, Carl Schroedl" />
            <jsp:param name="keywords" value="" />
            <jsp:param name="publisher" value="" />
            <jsp:param name="revisedDate" value="" />
            <jsp:param name="nextReview" value="" />
            <jsp:param name="expires" value="never" />
            <jsp:param name="development" value="<%= development%>" />
        </jsp:include>
		<script type="text/javascript">var CCH = {'Objects': {}};</script>
        <script type="text/javascript" src="webjars/jquery/2.0.0/jquery<%= development ? "" : ".min"%>.js"></script>
        <script type="text/javascript" src="webjars/jquery-ui/1.10.2/ui/minified/jquery-ui.min.js"></script>
        <link type="text/css" rel="stylesheet" href="webjars/jquery-ui/1.10.2/themes/base/minified/jquery-ui.min.css" />
        <link type="text/css" rel="stylesheet" href="webjars/bootstrap/2.3.1/css/bootstrap<%= development ? "" : ".min"%>.css" />
        <link type="text/css" rel="stylesheet" href="webjars/bootstrap/2.3.1/css/bootstrap-responsive<%= development ? "" : ".min"%>.css" />
        <script type="text/javascript" src="webjars/bootstrap/2.3.1/js/bootstrap<%= development ? "" : ".min"%>.js"></script>
    </head>
    <body>
        <jsp:include page="components/application-overlay.jsp"></jsp:include>
            <div id="application-container" class="container-fluid">

                <div id="header-row" class="row-fluid">
                <jsp:include page="template/USGSHeader.jsp">
                    <jsp:param name="relPath" value="" />
                    <jsp:param name="header-class" value="visible-desktop hidden-phone hidden-tablet" />
                    <jsp:param name="site-title" value="USGS Coastal Hazards Portal" />
                </jsp:include>
                <jsp:include page="components/app-navbar.jsp"></jsp:include>
                </div>
                <script type="text/javascript">splashUpdate("Loading Geospatial Framework...");</script>
                <div id="content-row" class="row-fluid">
                    <div id="map-wrapper" class="span7">
                        <div id="map"></div>
                    </div>
                    <div id="description-wrapper" class="span5"></div>
                </div>	

                <div  id="footer-row"  class="row-fluid">
                <jsp:include page="template/USGSFooter.jsp">
                    <jsp:param name="relPath" value="" />
                    <jsp:param name="footer-class" value="" />
                    <jsp:param name="site-url" value="<script type='text/javascript'>document.write(document.location.href);</script>" />
                    <jsp:param name="contact-info" value="<a href='mailto:jread@usgs.gov?Subject=Coastal%20Hazards%20Feedback'>Jordan Read</a>" />
                </jsp:include>
            </div>
        </div>
		<span id="map-search-container">
			<form class="app-navbar-search-form navbar-search" action="javascript:void(0);">
				<i id="app-navbar-search-icon" class="icon-search"></i><input id="app-navbar-search-input" type="text" class="search-query" placeholder="Search">
			</form>
		</span>

        <script type="text/javascript" src="webjars/openlayers/2.12/OpenLayers<%= development ? ".debug" : ""%>.js"></script>
        <jsp:include page="js/iosslider/iosslider.jsp"> 
            <jsp:param name="debug-qualifier" value="<%= development%>" /> 
        </jsp:include>
        <jsp:include page="js/iosslider-vertical/iosslider-vertical.jsp"> 
            <jsp:param name="debug-qualifier" value="<%= development%>" /> 
        </jsp:include>
		<jsp:include page="components/config.jsp"></jsp:include>
        <%-- TODO: Refactor log4javascript to take the log4js script from webjars --%>
        <jsp:include page="js/log4javascript/log4javascript.jsp">
            <jsp:param name="relPath" value="" />
            <jsp:param name="debug-qualifier" value="<%= development%>" />
        </jsp:include>

        <script type="text/javascript" src="js/openlayers/lib/OpenLayers/Layer/Shorelines.js"></script>
        <script type="text/javascript" src="js/components/slideshow/Slideshow.js"></script>
        <script type="text/javascript" src="js/components/search/Search.js"></script>
        <script type="text/javascript" src="js/components/session/Session.js"></script>
        <script type="text/javascript" src="js/components/map/Map.js"></script>
        <script type="text/javascript" src="js/components/card/Card.js"></script>
        <script type="text/javascript" src="js/components/card/Cards.js"></script>
        <script type="text/javascript" src="js/components/popularity/Popularity.js"></script>
        <script type="text/javascript" src="js/components/common/OWS.js"></script>
        <script type="text/javascript" src="js/components/common/UI.js"></script>
        <script type="text/javascript" src="js/components/common/OnReady.js"></script>

        <script type="text/javascript" src="webjars/sugar/1.3.8/sugar-full<%= development ? ".development" : ".min"%>.js"></script>
        <link type="text/css" rel="stylesheet" href="webjars/font-awesome/3.1.1/css/font-awesome<%= development ? "" : ".min"%>.css" />

        <script type="text/javascript">
			$('#footer > .content').addClass('visible-desktop hidden-phone hidden-tablet');
        </script>
		<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
		<a id='multi-card-twitter-button' class='twitter-share-button hide' data-lang='en' data-count='none' data-hashtags='cch' data-text='Check out my pinned items on CCH!' data-url='http://go.usa.gov/random' data-counturl='sid=SomeRandomSessionId'></a>
		<jsp:include page="components/item-search.jsp"></jsp:include>
    </body>
