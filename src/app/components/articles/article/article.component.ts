import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/model/article/article.service";
import {Article} from "../../../shared/models/article/article";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberService} from "../../../shared/services/model/member/member.service";
import {LanguageService} from "../../../shared/services/language/language.service";
import {Details, Subparagraph} from "../../../shared/models/common/details-subparagraphs";
import {Member} from "../../../shared/models/member/member";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: [
		'./article.component.css',
	  './../../../shared/global/css/article-event.css'
  ]
})
export class ArticleComponent implements OnInit{

	isDataLoaded: boolean = false;
	article: Article = {};
	allArticles: Article[] = [];

	articleLength = '';
	relatedArticlesTitle = '';

	relatedArticles: Article[] = [];

	member: Member = {};
	memberPhoto: string = '';
	mapArticleLang: Map<string, Details> = new Map();

	mapPhotoUrl: Map<string, string> = new Map();
	language: string = '';

	ngOnInit(): void {

		this.route.params.subscribe(params => {
			if (params) {
				const articleId = params['id'];

				this.articleService.getAll().subscribe(articles=> {
					articles.forEach(article=> {
						if (article.id! == articleId) {
							this.article = article;
						}
						else {
							this.allArticles.push(article);
							this.sortAllArticlesByDate();
						}
					});

					this.relatedArticles = this.allArticles.slice(0, 5);

					this.memberService.getAll().subscribe(members => {
						// retrieve the member
						this.member = members.filter(member => {
							return member.email == this.article.email
						}).at(0)!;
						// retrieve member's image
						this.memberService.getMemberPhoto(this.member.photo!).subscribe(photo => {
							this.memberPhoto = photo
						});
						// get the language
						this.languageService.language.subscribe(lang => {
							this.populateLanguageMap(lang, this.article);

							this.articleService.getCoverPhotoArticle(this.article).subscribe(cover => {
								this.mapPhotoUrl.set(
									'cover',
									cover
								);
							});

							this.initializeSubWithLang(lang, this.article);
						})
					})

					this.isDataLoaded = true;
				});
			}
		});

	}

	constructor(
		protected sanitizer: DomSanitizer,
		private route: ActivatedRoute,
		private router: Router,
		private articleService: ArticleService,
		private memberService: MemberService,
		private languageService: LanguageService,
	) {
	}


	populateLanguageMap(lang: string, article: Article) {
		switch (lang) {
			case 'en': {
				this.mapArticleLang.set(
					article.id!,
					article.en!
				);
				this.language = 'English';
				break;
			}
			case 'it': {
				this.mapArticleLang.set(
					article.id!,
					article.it!
				);
				this.language = 'Italiano';
				break;
			}
			case 'ko': {
				this.mapArticleLang.set(
					article.id!,
					article.ko!
				);
				this.language = '한국인';
				break;
			}
		}
	}

	initializeSubWithLang(lang: string, article: Article) {
		switch (lang) {
			case 'en': {
				this.articleLength = 'minutes lecture';
				this.relatedArticlesTitle = 'Discover these articles';
				this.populateMapPhoto(
					article.en?.subparagraphs!,
					article.id!
				);
				break;
			}
			case 'it': {
				this.articleLength = 'minuti di lettura';
				this.relatedArticlesTitle = 'Scopri questi articoli';
				this.populateMapPhoto(
					article.it?.subparagraphs!,
					article.id!
				);
				break;
			}
			case 'ko': {
				this.articleLength = '읽는 시간';
				this.relatedArticlesTitle = '이 기사들을 발견하세요';
				this.populateMapPhoto(
					article.ko?.subparagraphs!,
					article.id!
				);
				break;
			}
		}
	}

	populateMapPhoto(subparagraphs: Subparagraph[], articleId: string) {
		subparagraphs.forEach(sub=> {
			if (sub.photo) {
				this.articleService.getPhotoArticle(sub.photo, articleId).subscribe(photo=> {
					this.mapPhotoUrl.set(
						sub.photo!,
						photo
					)
				})
			}
		})
	}

	private sortAllArticlesByDate() {
		this.allArticles.sort((a, b) => {
			if (a.date_time?.toMillis()! < b.date_time?.toMillis()!) {
				return 1;
			}
			else if (a.date_time?.toMillis()! > b.date_time?.toMillis()!) {
				return -1;
			}
			else return 0;
		})
	}

	reloadCurrentRoute(articleId: string) {
		this.router.navigateByUrl('articles/article/' + articleId);
		this.isDataLoaded = false;
		this.article = {};
		this.allArticles = [];

		this.articleLength = '';
		this.relatedArticlesTitle = '';

		this.relatedArticles = [];

		this.member = {};
		this.memberPhoto = '';
		this.mapArticleLang = new Map();

		this.mapPhotoUrl = new Map();
	}

	changeLangArticle(language: string) {
		this.populateLanguageMap(language, this.article);
		this.initializeSubWithLang(language, this.article);
	}
}
