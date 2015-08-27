HexBinning
==========
Update: Now includes support for > 1000 data points, abbreviated extended tooltips, and support for Lasso functionality to selct multiple hexagons.

Hexagonal Binning Qlik Sense extension, based on hexbin.js D3 library.

Many thanks to Ralf Becher and Speros Kokenes for their assistance to make this a really nice looking and flexible extension.

The extension groups dense bunches of points into aggregated hexagonal bins.  

It has 2 modes: Area Binning and Colour Binning

Colour Binning
==============
The hexagonal bins are colour coded, relating to the density of points within the bin.  

Area Binning
============
The size of the hexagonal bin is relative to the count of points contained within the bin.

In both cases, you can select a single hexagon, and the relevant selections will be made in Sense.

An example (Hexagonal Binning - Fifa 14.qvf) is included.

Future improvements:
1. Visible member count inside hexagons
2. Ability to start lasso selection from inside a hexagon

Recent Improvements:
1. partly fixed: Scaling of hexagon sizes and responsive design (Ralf Becher)
2. fixed: Inverted (negative) y-axis and scale requires resolution (Ralf Becher)
3. fixed: Clipping of hexagons at edge of axes (Ralf Becher)
4. fixed: Configuration on hexagon size (Ralf Becher)
5. fixed: Configuration of hexagon colour (Ralf Becher)
6. fixed: Dealing with > 1000 points
7. added: Fixed layout and colouring for constant size on selection (Ralf Becher)
7. added: Option to fill the mesh with hexagons (Ralf Becher)
8. added: Area binning mode
9. added: minRadius property for area binning

![Qlik Sense Extension Hexagonal Binning](hexabin1.jpg)

![Qlik Sense Extension Hexagonal Binning](hexabin2.jpg)

![Qlik Sense Extension Hexagonal Binning](hexabin3.jpg)
