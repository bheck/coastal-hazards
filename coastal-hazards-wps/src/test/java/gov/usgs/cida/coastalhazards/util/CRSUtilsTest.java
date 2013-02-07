package gov.usgs.cida.coastalhazards.util;

import com.vividsolutions.jts.geom.MultiLineString;
import gov.usgs.cida.coastalhazards.wps.CreateTransectsAndIntersectionsProcessTest;
import java.io.IOException;
import java.net.URL;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.FeatureCollection;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Ignore;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

/**
 *
 * @author Jordan Walker <jiwalker@usgs.gov>
 */
public class CRSUtilsTest {

    /**
     * Test of getLinesFromFeatureCollection method, of class CRSUtils.
     * need to fill this stuff out
     */
    @Test
    @Ignore
    public void testGetLinesFromFeatureCollection() throws IOException {
        URL baselineShapefile = CreateTransectsAndIntersectionsProcessTest.class.getClassLoader()
                .getResource("gov/usgs/cida/coastalhazards/jersey/NewJerseyN_baseline.shp");
        FeatureCollection<SimpleFeatureType, SimpleFeature> baselinefc =
                FeatureCollectionFromShp.featureCollectionFromShp(baselineShapefile);
        MultiLineString expResult = null;
        MultiLineString result = CRSUtils.getLinesFromFeatureCollection((SimpleFeatureCollection)baselinefc);
        assertEquals(expResult, result);
    }
}
