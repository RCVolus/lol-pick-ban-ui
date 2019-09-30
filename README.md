# lol-champselect-ui
UI to display the league of legends champion selection in esports tournaments.

## Rough Architecture:
TODO (Graphic)

## Features
- Connects to the League Client and fetches information about the current champ select in real time
- Automatically fetches champion loading images, splash arts and square icons from datadragon, which means that if a new champion
is realised it will automatically fetch the correct resources.
- Ready to use design templates:
  - Europe (similar to the pick&ban UI used in the LEC)
- Easy feature toggle (when using design templates) for:
  - Show / hide scores (usable if it's not best of 1)
  - Show / hide coaches
  - Show / hide summoner spells (usable in live matches on the live server where the enemy team is not supposed to see the summoner 
  spells of the opposite team.
- Easy configuration:
  - Set team names
  - Set coach names
  - Set score
  - Set colors (default blue/red, but they can differ!)
- Allows to completely create a custom design based on web technologies (HTML, CSS & JS), including custom animations and
transitions

## Contributors / Maintainers
- Development: Lars "Larce" Bärtschi
- Design (Europe): Elias "Elilift" Inäbnit

Please feel free to contact me via Twitter and let me know if you used this project! I'm also happy to help out if any questions or inquiries or feedback appear regarding this! [@LarsBaertschi](https://twitter.com/LarsBaertschi)
