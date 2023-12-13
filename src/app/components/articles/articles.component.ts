import {Component} from '@angular/core';
import {ArticleService} from "../../shared/services/model/article/article.service";
import {Article} from "../../shared/models/article/article";
import {MemberService} from "../../shared/services/model/member/member.service";
import {Member} from "../../shared/models/member/member";
import {LanguageService} from "../../shared/services/language/language.service";
import {Details} from "../../shared/models/common/details-subparagraphs";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent {

	allArticles: Article[] = [];
	articleList: Article[] = [];
	allMembers: Member[] = [];
	isDataLoaded: boolean = false;

	mapArticlePhoto: Map<string, string> = new Map();
	mapArticleMember: Map<string, string> = new Map();
	mapArticleLanguage: Map<string, Details> = new Map();
	mapMemberPhoto: Map<string, string> = new Map();

	page = 1;
	pageSize = 10;

	constructor(
		private articleService: ArticleService,
		private memberService: MemberService,
		private languageService: LanguageService
	) {
		this.articleService.getAll().subscribe(articles => {

			this.allArticles = articles;
			this.articleList = articles;

			this.memberService.getAll().subscribe(members => {
				this.allMembers = members;

				this.languageService.language.subscribe(lang => {
					this.articleList.forEach(article => {

						//this.mapArticleLanguage.clear();
						this.populateLanguageMap(lang, article);

						this.articleService.getCoverPhotoArticle(article).subscribe(photo => {
							this.mapArticlePhoto.set(
								article.id!,
								photo
							)
						});
						this.allMembers.forEach(member => {
							if (member.email == article.email) {
								this.memberService.getMemberPhoto(member.photo!).subscribe(photo => {
									this.mapMemberPhoto.set(
										member.email!,
										photo
									);

									this.mapArticleMember.set(
										article.id as string,
										member.name + ' ' + member.surname
									);
								})
							}
						})
					});
				});
				this.isDataLoaded = true;
			})
		});
	}

	populateLanguageMap(lang: string, article: Article) {
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

	handlePageChange(pageNumber: number) {
		this.page = pageNumber;

		const startIndex = (this.page - 1) * this.pageSize;
		const endIndex = startIndex + this.pageSize;
		this.articleList = this.allArticles.slice(startIndex, endIndex);
	}
}
