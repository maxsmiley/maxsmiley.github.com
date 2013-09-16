Assignment 1: Performance
Max Smiley 
-------------------------
Performance Scores Prior to Improvements
using YSlow:
(B) - Use a Content Delivery Network (CDN)
(D) - Add Expires headers
(B) - Minify JavaScript and CSS
(B) - Make favicon small and cacheable
Everything else (A)

Timeline:

Additional:
	The spritesheet.png and death.png make 1 more request than necessary. 

Personal Rating: A-

1. Optimization Techniques:
	- .htaccess 
	- Make sheets into 1 image 
	- Compressed spirtesheet size
	- Minified JS and CSS files
2. Offline Chaching
	- Tested in in Firefox and Chrome
	- First opening the webpage online, then closing the browser, turning off my Wi-Fi, then reoppenin the page.
	- Additionally, both browsers will confirm in console that files were cached 
3. Tools Used 
	- ySlow
	- Google Analytics
	- Google Closure Compiler
	- MinifyCSS.com
4. Improvements
	- Smaller (Minified) size of JS, CSS and PNG Files
		- JS:  14KB -> 9KB
		- CSS: 233B -> 175B
		- PNG: 34 + 4KB -> 16KB
	- 1 Less resource retrieved (Single image sheet instead of 2)
5. Problems
	- CDN
	- Expiration Headers and .htaccess
	- Favicon

After Performance Improvements
using YSlow:
(A) - Use a Content Delivery Network (CDN)
	Note this is when using maxsmiley.github.io as a CDN
(D) - Add Expires headers
	Unfortunately this could not be tested since github does not allow for expirations
(A) - Minify JavaScript and CSS
(B) - Make favicon small and cacheable
	Do not have a favicon, so this cannot change. 
Everything else (A)

Personal Rating A:
