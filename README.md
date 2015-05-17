HexBinning
==========
First version of Hexagonal Binning Qlik Sense extension, based on hexbin.js D3 library.

This is a very much a first attempt.

The extension groups dense bunches of points into aggregated hexagonal bins.  These hexagonal bins are colour coded based on the Sequential Classes colour scale, relating to the density of points within the bin.  You can select a single hexagon, and the relevant selections will be made in Sense.

An example (Hexagonal Binning.qvf) is included.

Future improvements:

1. partly fixed: Scaling of hexagon sizes and responsive design
2. Dealing with > 1000 points
3. Inverted (negative) y-axis and scale requires resolution
4. fixed: Clipping of hexagons at edge of axes
5. fixed: Configuration on hexagon size
6. fixed: Configuration of hexagon colour
7. added: Fixed layout and colouring for constant size on selection
8. added: Option to fill the mesh with hexagons

![Qlik Sense Extension Hexagonal Binning](hexabin1.jpg)

![Qlik Sense Extension Hexagonal Binning](hexabin2.jpg)
