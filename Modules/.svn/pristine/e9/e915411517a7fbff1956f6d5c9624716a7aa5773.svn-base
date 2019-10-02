/*
  BB1 G Truslove - Nov 2017
  Knowledge Base Articles
*/

define('Article.Model', [
    'SC.Model'
  ],
  function(SCModel) {
    return SCModel.extend({
      name: 'Article',
      getSiteCode: function(site) {
        switch (site) {
          case "Ireland":
            return "3";
          case "France":
            return "4";
          case "Global":
            return "5";
        }
        return "2";

      },
      get: function(url, site, language) {
        //nlapiLogExecution("ERROR", "SCA Testing", "Language=" + language + " Site=" + site);
        var filters = [],
          columns = [];

        filters.push(['isinactive', 'is', 'F']);
        filters.push('AND');
        filters.push(['custrecord_bb1_sca_a_url', 'is', url]);
        filters.push('AND');
        filters.push(['custrecord_bb1_sca_a_language', 'anyof', language.toString()]);
        if (site) {

          //"@NONE@","1","5"

          filters.push('AND');
          //nlapiLogExecution("ERROR", "SCA Testing", "Match Site=" + site + " " + this.getSiteCode(site));
          filters.push(['custrecord_147_cseg_bb1_website_se', 'anyof', "@NONE@", "1", this.getSiteCode(site)]);
        }


        columns.push(new nlobjSearchColumn('name'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_type'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_summary'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_keywords'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_content'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_image'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_url'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_language'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_priority'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_colour'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_relateditems'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_relatedarticles'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_relatedcontent'));





        var searchresults = nlapiSearchRecord('customrecord_bb1_sca_article', null, filters, columns);

        var res;
        var Info = {};
        for (var i in searchresults) {
          res = searchresults[i];
          Info = {
            internalid: res.getId(),
            name: res.getValue("name"),
            type: res.getValue("custrecord_bb1_sca_a_type"),
            summary: res.getValue("custrecord_bb1_sca_a_summary"),
            keywords: res.getValue("custrecord_bb1_sca_a_keywords"),
            content: res.getValue("custrecord_bb1_sca_a_content"),
            relatedcontent: res.getValue("custrecord_bb1_sca_a_relatedcontent"),
            image: res.getText("custrecord_bb1_sca_a_image"),
            url: res.getValue("custrecord_bb1_sca_a_url"),
            language: res.getValue("custrecord_bb1_sca_a_language"),
            priority: res.getValue("custrecord_bb1_sca_a_priority"),
            colour: res.getValue("custrecord_bb1_sca_a_colour"),
            relateditems: res.getValue("custrecord_bb1_sca_a_relateditems"),
            relatedarticles: this.getRelatedArticles(res.getValue("custrecord_bb1_sca_a_relatedarticles"), site, language)
          };
          break;
        }
        return Info;
      },
      getRelatedArticles: function(articles, site, language) { //Get related article links
        if (!articles || articles.length == 0) {
          return [];
        }
        var filters = [],
          columns = [];


        filters.push(['isinactive', 'is', 'F']);
        filters.push('AND');
        filters.push(['internalid', 'anyof', articles.split(',')]);
        filters.push('AND');
        filters.push(['custrecord_bb1_sca_a_language', 'anyof', language.toString()]);
        filters.push('AND');
        filters.push(['custrecord_bb1_sca_a_approved', 'is', 'T']);
        if (site) {
          filters.push('AND');
          filters.push(['custrecord_147_cseg_bb1_website_se', 'anyof', "@NONE@", "1", this.getSiteCode(site)]);
        }


        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_url'));
        columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_type'));

        var SC = new nlobjSearchColumn('name');
        SC.setSort(false);
        columns.push(SC);

        var searchresults = nlapiSearchRecord('customrecord_bb1_sca_article', null, filters, columns);

        var res;
        var List = [];
        for (var i in searchresults) {
          res = searchresults[i];
          List.push({
            internalid: res.getId(),
            name: res.getValue("name"),
            type: res.getValue("custrecord_bb1_sca_a_type"),
            url: res.getValue("custrecord_bb1_sca_a_url"),
          });

        }

        return List;
      },
      higherPriority: function(priority) { //This priority should be pushed up the page


        var priorities = { LargeBanner: 1, MediumImage: 2, Standard: 3, Archive: 4, Hidden: 5, HomePageBanner: 6, HomePageText: 7, HomePageImage: 8 };

        return priority == priorities.LargeBanner || priority == priorities.MediumImage || priority == priorities.HomePageBanner || priority == priorities.HomePageText || priority == priorities.HomePageImage;
      },
      HTMLToText: function(content) { //remove all the html tags from some html.
        if (!content) {
          return;
        }


        var char, charCode, InTag, InSQuote, InDQuote,
          body = "",
          next, lastspace = true;
        for (var i = 0; i < content.length; i++) {
          char = content.charAt(i);
          charCode = content.charCodeAt(i);

          if (i < content.length - 1) {
            next = content.charAt(i + 1);
          } else {
            next = "";
          }


          switch (char) {
            case "<": //Open tag
              if (!InTag) {
                InTag = true;
              }
              if (!lastspace) {
                body += " ";
                lastspace = true;
              }
              break;
            case ">": //Close tag
              if (InTag && !InSQuote && !InDQuote) {
                InTag = false;
              } else {
                if (!InTag) {
                  body += char;
                }
              }
              break;
            case "\\": //Skip escaped characters
              if ((InSQuote || InDQuote) && (next == "\"" || next == "'")) {
                i++;
              } else {
                if (!InTag) {
                  body += char;
                }
              }
              break;
            case "\"":
              if (InTag) {
                if (InSQuote) {} else if (InDQuote) {
                  InDQuote = false;
                } else {
                  InDQuote = true;
                }
                if (!InTag) {
                  body += char;
                }
              } else {
                body += char;
              }
              break;
            case "'":
              if (InTag) {
                if (InSQuote) { InSQuote = false; } else if (InDQuote) {} else {
                  InSQuote = true;
                }
              } else {
                if (!InTag) {
                  body += char;
                }
              }
              break;
            case "\r":
              break;
            case "\n":
              break;
            default:
              if (!InTag) {
                body += char;
                if (char != " ") {
                  lastspace = false;
                }
              }
              break;
          }
        }
        return body.trim();

      },
      list: function(Type, site, language, showonhomepage, query) {
//nlapiLogExecution("ERROR", "SCA Testing", "Language=" + language + " Site=" + site+" Type="+Type);
        try {
          var filters = [],
            columns = [];
          var OnlyOneType = Type && Type.length == 1;


          filters.push(['isinactive', 'is', 'F']);
          filters.push('AND');
          filters.push(['custrecord_bb1_sca_a_language', 'anyof', language.toString()]);
          filters.push('AND');
          filters.push(['custrecord_bb1_sca_a_approved', 'is', 'T']);
          if (site) {
            filters.push('AND');
            filters.push(['custrecord_147_cseg_bb1_website_se', 'anyof', "@NONE@", "1", this.getSiteCode(site)]);
          }

          if (showonhomepage) {
            filters.push('AND');
            filters.push(['custrecord_bb1_sca_a_showonhomepage', 'is', 'T']);
          } else {

            if (query) {
              var words = query.toLowerCase().split(' ');
              var subfilter;
              for (var i = 0; i < words.length; i++) {
                filters.push('AND');
                subfilter = [];
                subfilter.push(['name', 'contains', words[i]]);
                subfilter.push('OR');
                subfilter.push(['custrecord_bb1_sca_a_content', 'contains', words[i]]);
                subfilter.push('OR');
                subfilter.push(['custrecord_bb1_sca_a_relatedcontent', 'contains', words[i]]);
                subfilter.push('OR');
                subfilter.push(['custrecord_bb1_sca_a_keywords', 'contains', words[i]]);


                filters.push(subfilter);
              }
            } else {
              if (Type && Type.length > 0) {
                if (Type.length == 1) {
                  filters.push('AND');
                  filters.push(['custrecord_bb1_sca_a_type', 'anyof', Type]);
                  filters.push('AND');
                  filters.push(['custrecord_bb1_sca_a_priority', 'anyof', [1, 2, 3, 4, 6, 7, 8]]);
                } else if (Type.length > 1) {
                  filters.push('AND');
                  filters.push(['custrecord_bb1_sca_a_type', 'anyof', Type]);
                  filters.push('AND');
                  filters.push(['custrecord_bb1_sca_a_priority', 'anyof', [1, 2, 3, 6, 7, 8]]);
                }
              }
            }
          }
          columns.push(new nlobjSearchColumn('name'));
          columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_image'));
          columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_listimage'));
          columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_url'));
          columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_colour'));
          columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_priority'));

          if (showonhomepage) {
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_homepagewidth'));
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_content'));
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_homepagecontent'));
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_buttontext'));
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_homepageimage'));
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_homepagepriority'));
          } else {
            if (query) {
              columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_content'));
            }
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_pagewidth'));
          }

          var SC;

          if (showonhomepage) {
            columns.push(new nlobjSearchColumn('custrecord_bb1_sca_a_type'));

            SC = new nlobjSearchColumn('custrecord_bb1_sca_a_homepageorder');
            SC.setSort(false);
            columns.push(SC);
          } else {

            var SC = new nlobjSearchColumn('custrecord_bb1_sca_a_type');
            SC.setSort(false);
            columns.push(SC);

            SC = new nlobjSearchColumn('custrecord_bb1_sca_a_order');
            SC.setSort(false);
            columns.push(SC);
          }





          var searchresults = nlapiSearchRecord('customrecord_bb1_sca_article', null, filters, columns);

          //sort by priority
          var res, newarticle;

          if (!showonhomepage&&false) { //Don't sort any more.
            var swap, changed;
            do {
              changed = false;
              for (var i = 0; i < searchresults.length - 1; i++) {
                if (!this.higherPriority(searchresults[i].getValue("custrecord_bb1_sca_a_priority")) && this.higherPriority(searchresults[i + 1].getValue("custrecord_bb1_sca_a_priority"))) {
                  swap = searchresults[i];
                  searchresults[i] = searchresults[i + 1];
                  searchresults[i + 1] = swap;
                  changed = true;
                }
              }
            } while (changed);
          }


          //convert to JSON

          var List = [];
          var lasttype, newtype, lastpriority, newpriority, lasthomepriority, newhomepriority, imageleft = true,firsttypecolour;
          for (var i in searchresults) {
            res = searchresults[i];
            newtype = res.getValue("custrecord_bb1_sca_a_type");
            if (List.length > 0 && newtype != lasttype && !query && !showonhomepage) { //Nesting views in backbone seems to be too much hassle, so just adding a endoftype check.
              List.push({ type: lasttype, endoftype: true ,colour:firsttypecolour});
            }
            newpriority = res.getValue("custrecord_bb1_sca_a_priority");
            
            if (showonhomepage) {
              newhomepriority = res.getValue('custrecord_bb1_sca_a_homepagepriority');
              if (newhomepriority > 5 || newhomepriority == 2) {
                newhomepriority = 1;
              }
            }else{
              if (newpriority > 5 || newpriority == 2) {
                newpriority = 1;
              }
              if (newpriority == 4 ) {
                newpriority = 3;
              }
            }
            if (newpriority != lastpriority) {
              imageleft = true;
            }
            newarticle = {
              internalid: res.getId(),
              name: res.getValue("name"),
              type: newtype,
              image: res.getText("custrecord_bb1_sca_a_listimage")||res.getText("custrecord_bb1_sca_a_image"),
              url: res.getValue("custrecord_bb1_sca_a_url"),
              priority: res.getValue("custrecord_bb1_sca_a_priority"),
              colour: res.getValue("custrecord_bb1_sca_a_colour"),
              firsttype: !showonhomepage && newtype != lasttype,
              firstpriority: (showonhomepage && newhomepriority != lasthomepriority) || (!showonhomepage && newpriority != lastpriority),
              imageleft: imageleft
            };
            if (query) {
              newarticle.content = this.HTMLToText(res.getValue('custrecord_bb1_sca_a_content'));
              if (newarticle.content && newarticle.content.length > 300) {
                newarticle.content = newarticle.content.substring(0, 300) + "...";
              }
              newarticle.priority = 0;
              newarticle.pagewidth = 5;
            }
            if (newarticle.firsttype) {
            firsttypecolour=newarticle.colour;
              newarticle.onlyonetype = OnlyOneType; //There is only one type so make the list header simple.
            }

            if (showonhomepage) {
            newhomepriority = res.getValue('custrecord_bb1_sca_a_homepagepriority');
              newarticle.image = res.getText('custrecord_bb1_sca_a_homepageimage') || newarticle.image;
              newarticle.priority = newhomepriority || newarticle.priority;
              newarticle.order = res.getValue('custrecord_bb1_sca_a_homepageorder');
              newarticle.width = res.getValue('custrecord_bb1_sca_a_homepagewidth');
              newarticle.buttontext = res.getValue('custrecord_bb1_sca_a_buttontext');
              if (newarticle.priority != 2 ||newarticle.priority != 3 || newarticle.priority != 4 || newarticle.priority != 5) {
                newarticle.content = res.getValue('custrecord_bb1_sca_a_homepagecontent') ||res.getValue('custrecord_bb1_sca_a_content');
              }
            } else {
              if (!query) {
                newarticle.order = res.getValue('custrecord_bb1_sca_a_order');
                newarticle.pagewidth = res.getValue('custrecord_bb1_sca_a_pagewidth');
              }
            }

            List.push(newarticle);

            lasttype = newtype;
            lastpriority = newpriority;
            lasthomepriority = lastpriority;
            if (lasthomepriority > 5) {
              lasthomepriority = 1;
            }
            imageleft = !imageleft;
          }
          if (List.length > 0 && !query && !showonhomepage && Type && Type.length > 1) { //Nesting views in backbone seems to be too much hassle, so just adding a endoftype check.
            List.push({ type: lasttype, endoftype: true,colour:firsttypecolour });
          }


          //nlapiLogExecution("ERROR", "SCA Article Main", JSON.stringify(List));
          return List;
        } catch (err) {
          nlapiLogExecution("ERROR", "SCA Article Main Error", err.toString());
          return []
        }
      }
    });
  })