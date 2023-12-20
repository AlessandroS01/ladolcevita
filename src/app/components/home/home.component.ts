import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../shared/services/page-info/home/home.service";
import {ArticleService} from "../../shared/services/model/article/article.service";
import {Article} from "../../shared/models/article/article";
import {LanguageService} from "../../shared/services/language/language.service";
import {Details} from "../../shared/models/common/details-subparagraphs";
import {MemberService} from "../../shared/services/model/member/member.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
	  './../../shared/global/css/articles-events.css',
		'./home.component.css'
  ]
})
export class HomeComponent {

	articles: Article[] = [];

	mapArticlePhoto: Map<string, string> = new Map();
	mapMemberPhoto: Map<string, string> = new Map();
	mapArticleMember: Map<string, string> = new Map();
	mapArticleLanguage: Map<string, Details> = new Map();

  constructor(
    private articleService: ArticleService,
    private languageService: LanguageService,
    private memberService: MemberService
  ) {
		this.articleService.getAll().subscribe(articles=> {
			articles.sort((a, b) => {
				if (a.date_time?.toMillis()! < b.date_time?.toMillis()!) {
					return 1;
				}
				else if (a.date_time?.toMillis()! > b.date_time?.toMillis()!) {
					return -1;
				}
				else return 0;
			});

			this.articles = articles.slice(0, 2);
			this.memberService.getAll().subscribe(members=> {

				this.languageService.language.subscribe(lang=> {

					this.articles.forEach(article=> {
						this.articleService.getCoverPhotoArticle(article).subscribe(photo=> {
							this.mapArticlePhoto.set(
								article.id!,
								photo
							)
						});
						this.populateLanguageMap(lang, article);

						members.forEach(member=> {
							if (member.email == article.email) {
								this.memberService.getMemberPhoto(member.photo!).subscribe(photo=> {
									this.mapArticleMember.set(
										article.id as string,
										member.name + ' ' + member.surname
									);
									this.mapMemberPhoto.set(
										member.email as string,
										photo
									)
								})
							}
						})
					});

				})

			});

		})
  }


	private populateLanguageMap(lang: string, article: Article) {
		switch (lang) {
			case 'en': {
				this.mapArticleLanguage.set(
					article.id!,
					article.en!
				);
				break;
			}
			case 'it': {
				this.mapArticleLanguage.set(
					article.id!,
					article.it!
				);
				break;
			}
			case 'ko': {
				this.mapArticleLanguage.set(
					article.id!,
					article.ko!
				);
				break;
			}
		}
	}
}
