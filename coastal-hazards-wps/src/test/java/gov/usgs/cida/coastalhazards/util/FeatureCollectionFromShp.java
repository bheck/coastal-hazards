/*
 * U.S.Geological Survey Software User Rights Notice
 * 
 * Copied from http://water.usgs.gov/software/help/notice/ on September 7, 2012.  
 * Please check webpage for updates.
 * 
 * Software and related material (data and (or) documentation), contained in or
 * furnished in connection with a software distribution, are made available by the
 * U.S. Geological Survey (USGS) to be used in the public interest and in the 
 * advancement of science. You may, without any fee or cost, use, copy, modify,
 * or distribute this software, and any derivative works thereof, and its supporting
 * documentation, subject to the following restrictions and understandings.
 * 
 * If you distribute copies or modifications of the software and related material,
 * make sure the recipients receive a copy of this notice and receive or can get a
 * copy of the original distribution. If the software and (or) related material
 * are modified and distributed, it must be made clear that the recipients do not
 * have the original and they must be informed of the extent of the modifications.
 * 
 * For example, modified files must include a prominent notice stating the 
 * modifications made, the author of the modifications, and the date the 
 * modifications were made. This restriction is necessary to guard against problems
 * introduced in the software by others, reflecting negatively on the reputation of the USGS.
 * 
 * The software is public property and you therefore have the right to the source code, if desired.
 * 
 * You may charge fees for distribution, warranties, and services provided in connection
 * with the software or derivative works thereof. The name USGS can be used in any
 * advertising or publicity to endorse or promote any products or commercial entity
 * using this software if specific written permission is obtained from the USGS.
 * 
 * The user agrees to appropriately acknowledge the authors and the USGS in publications
 * that result from the use of this software or in products that include this
 * software in whole or in part.
 * 
 * Because the software and related material are free (other than nominal materials
 * and handling fees) and provided "as is," the authors, the USGS, and the 
 * United States Government have made no warranty, express or implied, as to accuracy
 * or completeness and are not obligated to provide the user with any support, consulting,
 * training or assistance of any kind with regard to the use, operation, and performance
 * of this software nor to provide the user with any updates, revisions, new versions or "bug fixes".
 * 
 * The user assumes all risk for any damages whatsoever resulting from loss of use, data,
 * or profits arising in connection with the access, use, quality, or performance of this software.
 */

package gov.usgs.cida.coastalhazards.util;

import gov.usgs.cida.coastalhazards.r.IntersectionParserTest;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.FeatureSource;
import org.geotools.feature.FeatureCollection;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

/**
 *
 * @author Jordan Walker <jiwalker@usgs.gov>
 */
public class FeatureCollectionFromShp {

    private URL shapefile;
    
    @Before
    public void setupShape() {
        shapefile = FeatureCollectionFromShp.class.getClassLoader().getResource("gov/usgs/cida/coastalhazards/blandit/blandit_intersects.shp");
    }

    public static FeatureCollection<SimpleFeatureType, SimpleFeature> featureCollectionFromShp(URL shp) throws IOException {
        FeatureCollection<SimpleFeatureType, SimpleFeature> featureCollection = null;
        
        Map<String, URL> connectParameters = new HashMap<String, URL>();
        connectParameters.put("url", shp);
        DataStore dataStore = DataStoreFinder.getDataStore(connectParameters);
        String[] typeNames = dataStore.getTypeNames();
        String name = null;
        if (typeNames.length == 1) {
            name = typeNames[0];
        }
        else {
            throw new RuntimeException("I don't know how to deal with this");
        }
        SimpleFeatureType schema = dataStore.getSchema(name);
        FeatureSource<SimpleFeatureType, SimpleFeature> featureSource = 
                dataStore.getFeatureSource(name);
        featureCollection = featureSource.getFeatures();
        return featureCollection;
    }
    
    @Test
    public void testFeatureCollectionFromShp() throws IOException {
        FeatureCollection<SimpleFeatureType, SimpleFeature> fc = featureCollectionFromShp(shapefile);
        assertNotNull(fc);
        assertEquals(fc.size(), 331);
    }
    
}
