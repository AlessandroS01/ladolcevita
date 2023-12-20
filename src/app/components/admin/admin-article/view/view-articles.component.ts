import { Component } from '@angular/core';
import {Event} from "../../../../shared/models/event/event";
import {EventService} from "../../../../shared/services/model/event/event.service";
import {Article} from "../../../../shared/models/article/article";
import {ArticleService} from "../../../../shared/services/model/article/article.service";
import {MemberService} from "../../../../shared/services/model/member/member.service";
import {Member} from "../../../../shared/models/member/member";

@Component({
  selector: 'app-view-articles',
  templateUrl: './view-articles.component.html',
  styleUrls: [
    './view-articles.component.css',
    '../../../../shared/global/css/admin-table-pages.css'
  ]
})
export class ArticlesViewComponent {

  isDataLoaded: boolean = false;
  allArticles: Article[] = [];
	allArticlesFiltered: Article[] = [];
	articleListDisplayed: Article[] = [];
  allMembers: Member[] = [];

  articleList: Article[] = [];

  mapCoverPhoto: Map<string, string> = new Map<string, string>();
  mapArticleMember: Map<string, string> = new Map<string, string>();

  page = 1;
  pageSize = 5;

  constructor(
    private articleService: ArticleService,
    private memberService: MemberService
  ) {
    this.memberService.getAll().subscribe(members => {
      this.allMembers = members;

      this.articleService.getAll().subscribe(articles => {
	      this.allArticles = articles;
	      this.allArticlesFiltered = articles;
	      this.articleListDisplayed = articles;

        this.allArticles.forEach(article => {
          this.articleService.getCoverPhotoArticle(article).subscribe(photo => {
            this.mapCoverPhoto.set(
              article.photo as string,
              photo
            );
          });

          this.allMembers.forEach(member=> {
            if (member.email == article.email) {
              this.mapArticleMember.set(
                article.id as string,
                member.name as string + ' ' + member.surname as string
              )
            }
          });

          this.articleList.push(article);

        });

        this.sortingArticleList();
        this.isDataLoaded = true;
      });
    })
  }

  handlePageChange(pageNumber: number) {
    this.page = pageNumber;

    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

	  this.articleListDisplayed = this.allArticlesFiltered.slice(startIndex, endIndex);
  };


  private sortingArticleList() {
	  this.allArticlesFiltered.sort((a, b) => {
		  if (a.date_time?.toMillis()! < b.date_time?.toMillis()!) {
			  return 1;
		  }
		  else if (a.date_time?.toMillis()! > b.date_time?.toMillis()!) {
			  return -1;
		  }
		  else return 0;
	  });
  }

  onSelectChange(value: string) {
    if (value == 'all') {
	    this.allArticlesFiltered = this.allArticles;
    } else {
	    this.allArticlesFiltered = this.allArticles.filter(article=> {
		    return article.email == value
	    });
    }
	  this.sortingArticleList();
	  this.articleListDisplayed = this.allArticlesFiltered;
  }

  deleteArticle(article: Article) {
    if (confirm("Are you sure you want to delete the selected article?")) {
      this.articleService.deleteFolder(article.id as string);
      return;
    } else {
      return;
    }
  }
}
