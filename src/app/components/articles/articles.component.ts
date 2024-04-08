import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../shared/services/model/article/article.service";
import {Article} from "../../shared/models/article/article";
import {MemberService} from "../../shared/services/model/member/member.service";
import {Member} from "../../shared/models/member/member";
import {LanguageService} from "../../shared/services/language/language.service";
import {Details} from "../../shared/models/common/details-subparagraphs";
import {Router} from "@angular/router";
import {forkJoin, map, switchMap} from "rxjs";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: [
		'./articles.component.css',
	  './../../shared/global/css/articles-events.css'
  ]
})
export class ArticlesComponent implements OnInit{

	allArticles: Article[] = [];
	allArticlesFiltered: Article[] = [];
	articleListDisplayed: Article[] = [];
	allMembers: Member[] = [];
	isDataLoaded: boolean = false;

	mapArticlePhoto: Map<string, string> = new Map();
	mapArticleMember: Map<string, string> = new Map();
	mapArticleLanguage: Map<string, Details> = new Map();
	mapMemberPhotos: Map<string, string> = new Map();
	mapMemberVisible: Map<string, boolean> = new Map();

	lang: string = 'en';

	page = 1;
	pageSize = 8;



	constructor(
		private articleService: ArticleService,
		private memberService: MemberService,
		private languageService: LanguageService,
	) {
	}

	ngOnInit(): void {
		this.memberService.getAll().pipe(
			switchMap(members => {
				this.allMembers = members;

				const photoObservables = members.map(member =>
					this.memberService.getMemberPhoto(member.photo as string)
				);

				return forkJoin(photoObservables).pipe(
					map(photos => {
						photos.forEach((photo, index) => {
							this.mapMemberPhotos.set(members[index].email as string, photo);
						});
						return members;
					})
				);
			}),
			switchMap(members => {
				return this.articleService.getAll().pipe(
					map(articles => {
						this.allArticles = articles;
						this.allArticlesFiltered = articles;
						this.articleListDisplayed = articles;
						return articles;
					})
				);
			}),
			switchMap(articles => {
				return this.languageService.language.pipe(
					map(lang => {
						this.lang = lang;
						this.articleListDisplayed.forEach(article => {
							this.populateLanguageMap(lang, article);
							this.populateMaps(article);
							this.articleService.getCoverPhotoArticle(article).subscribe(photo => {
								this.mapArticlePhoto.set(article.id!, photo);
							});
						});
						return articles;
					})
				);
			})
		).subscribe(() => {
			this.isDataLoaded = true;
			this.sortingArticleList();
		});
	}

	private populateMaps(article: Article) {
		this.allMembers.forEach(member => {
			this.mapMemberVisible.set(member.email!, true);

			if (member.email == article.email) {
				this.mapArticleMember.set(
					article.id as string,
					member.name + ' ' + member.surname
				);
			}
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

		this.articleListDisplayed = this.allArticlesFiltered.slice(startIndex, endIndex);
	}

	sortingArticleList() {
		this.allArticlesFiltered.sort((a, b) => {
			if (a.date_time?.toMillis()! < b.date_time?.toMillis()!) {
				return 1;
			}
			else if (a.date_time?.toMillis()! > b.date_time?.toMillis()!) {
				return -1;
			}
			else return 0;
		})
	}

	toggleMemberArticle(member: Member, id: string) {
		const memberEmail = member.email!;

		const element = document.getElementById(id);

		if (element) {
			if (this.mapMemberVisible.get(memberEmail)) {
				this.mapMemberVisible.set(
					memberEmail,
					false
				);
				element.classList.remove('active');

				this.allArticlesFiltered = this.allArticlesFiltered.filter(article=> {
					return article.email != memberEmail
				});
			} else {
				this.mapMemberVisible.set(
					memberEmail,
					true
				);
				element.classList.add('active');

				this.allArticles.filter(article=> {
					return article.email == memberEmail
				}).forEach(article=> {
					this.allArticlesFiltered.push(article);
				});
			}
		}
		this.articleListDisplayed = this.allArticlesFiltered;

		this.sortingArticleList();
	}
}
