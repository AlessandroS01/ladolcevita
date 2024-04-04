import { Component } from '@angular/core';
import {editorConfig} from "../../../../shared/global/variables/global";
import {MemberService} from "../../../../shared/services/model/member/member.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Member} from "../../../../shared/models/member/member";
import {FormControl, Validators} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {combineLatest, Observable} from "rxjs";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";
import {MatDialog} from "@angular/material/dialog";

const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);

@Component({
  selector: 'app-members-modify',
  templateUrl: './members-modify.component.html',
  styleUrls: [
	  '../../../../shared/global/css/text-editor.css',
		'./members-modify.component.css'
  ]
})
export class MembersModifyComponent {

	isDataLoaded: boolean = false;

	memberUid: string = '';
	submitted: boolean = false;
	email: string = '';
	member: Member | null = null;

	allMembersEmail: string[] = [];

	allMembersPhotoNames: string[] = [];


	emailFormControl: FormControl = new FormControl(
		'', [
			Validators.required,
			Validators.email,
			Validators.pattern(
				'^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
			)
		]
	);
	nameFormControl: FormControl = new FormControl('', [Validators.required]);
	surnameFormControl: FormControl = new FormControl('', [Validators.required]);
	roleFormControl: FormControl = new FormControl('', [Validators.required]);
	photoFormControl: FormControl = new FormControl('', [Validators.required, imageValidator]);
	memberPhotoUploaded: any;
	universityFormControl: FormControl = new FormControl('', [Validators.required]);
	facultyFormControl: FormControl = new FormControl('', [Validators.required]);
	levelFormControl: FormControl = new FormControl(1, [Validators.required]);

	constructor(
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private router: Router,
		private memberService: MemberService
	) {
		this.route.params.subscribe(params=> {
			this.email = params['email'];

			this.memberService.getDocumentAndMemberByEmail(this.email).subscribe(data =>{

				const member = data.memberData;

				if (member != null) {

					this.member = member as Member;

					this.memberUid = data.documentId as string;

					this.memberService.getMemberPhoto(member?.photo!).subscribe(photo=> {
						this.memberPhotoUploaded = photo;

						this.changePropertyImageContainer('uploaded');

						const imgElement = document.getElementById("uploaded-image") as HTMLImageElement;
						imgElement.src = photo;
					});

					this.emailFormControl = new FormControl(
						member?.email!,
						[
							Validators.required,
							Validators.email,
							Validators.pattern(
								'^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
							)
						]
					);
					this.facultyFormControl = new FormControl(
						member?.faculty,
						[
							Validators.required
						]
					);
					this.nameFormControl = new FormControl(
						member?.name,
						[
							Validators.required
						]
					);
					this.photoFormControl = new FormControl(
						'',
						[
							Validators.required,
							imageValidator
						]
					);
					this.roleFormControl = new FormControl(
						member?.role,
						[
							Validators.required
						]
					);
					this.surnameFormControl = new FormControl(
						member?.surname,
						[
							Validators.required
						]
					);
					this.universityFormControl = new FormControl(
						member?.university,
						[
							Validators.required
						]
					);
					this.levelFormControl = new FormControl(
						member?.level,
						[
							Validators.required
						]
					);

					this.memberService.getAllMembersPhotoNames().subscribe(names=> {
						this.allMembersPhotoNames = names;
					});

					this.memberService.getAll().subscribe(members=> {
						this.allMembersEmail = members.map(member=> {
							return member.email!
						});

						this.isDataLoaded = true;
					});
				}
			});
		});
	}


	protected readonly editorConfig = editorConfig;

	onFileChange(event: any) {
		const selectedFile = event.target.files[0];
		if (selectedFile != null) {
			this.memberPhotoUploaded = selectedFile;

			this.changePropertyImageContainer('uploaded');

			const imageUrl = URL.createObjectURL(selectedFile);
			const imgElement = document.getElementById('uploaded-image') as HTMLImageElement;
			imgElement.src = imageUrl;
		} else {
			this.changePropertyImageContainer('removed');
		}
	}

	changePropertyImageContainer(action: string) {
		const div = document.getElementById('im-cont');
		if (div != null) {
			if (action === 'removed') {
				if (!div.classList.contains('hidden')) {
					div.classList.add('hidden');
				}
			} else if (action === 'uploaded'){
				if (div.classList.contains('hidden')) {
					div.classList.remove('hidden');
				}
			}

		}
	}

	submitForm() {
		this.submitted = true;

		if (
			this.checkValidityMainInfo()
		) {
			const coverPhotoChanged: boolean =
				this.photoFormControl.dirty
				&&
				this.photoFormControl.valid;

			this.modifyExistingMember(coverPhotoChanged);
		}
	}

	private checkValidityMainInfo(): boolean {
		let validity = true;

		if (this.emailFormControl.invalid) {
			window.alert("The email is invalid");
			validity = false;
		} else {
			validity = this.allMembersEmail.filter(email=> {
					return (
							email == this.emailFormControl.value
						&&
							email != this.member?.email as string
					)
				}
			).length == 0;
			if (!validity) {
				window.alert(
					"The email is already saved for another member"
				)
			}
		}
		if (this.nameFormControl.invalid) {
			window.alert("The name is invalid");
			validity = false;
		}
		if (this.surnameFormControl.invalid) {
			window.alert("The surname is invalid");
			validity = false;
		}
		if (this.roleFormControl.invalid) {
			window.alert("The role is invalid");
			validity = false;
		}
		if (this.universityFormControl.invalid) {
			window.alert("The university is invalid");
			validity = false;
		}
		if (this.levelFormControl.invalid) {
			window.alert("The level is invalid");
			validity = false;
		}
		if (this.facultyFormControl.invalid) {
			window.alert("The faculty is invalid");
			validity = false;
		}
		if (this.photoFormControl.invalid) {
			window.alert("The photo is invalid");
			validity = false;
		}

		return validity;
	}

	private modifyExistingMember(coverPhotoChanged: boolean) {
		const arrayUploadingFiles: File[] = [];

		const updatedMember = new Member();

		if (this.photoFormControl.value) {
			let fullPath = this.photoFormControl.value;
			updatedMember.photo = fullPath.split('\\').pop();
			arrayUploadingFiles.push(this.memberPhotoUploaded as File);
		} else {
			updatedMember.photo = this.member?.photo;
		}

		updatedMember.email = this.emailFormControl.value;
		updatedMember.name = this.nameFormControl.value;
		updatedMember.surname = this.surnameFormControl.value;
		updatedMember.level = this.levelFormControl.value;
		updatedMember.university = this.universityFormControl.value;
		updatedMember.faculty = this.facultyFormControl.value;
		updatedMember.role = this.roleFormControl.value;

		if (this.checkPhotoNames(updatedMember)) {

			// if Photo was not changed
			// else Photo was changed

			if (
				this.memberPhotoUploaded instanceof File
			) {
				this.memberService.deleteFile(
					updatedMember,
					this.member?.photo as string
				)
			}

			this.memberService.update(
				this.memberUid,
				updatedMember
			).subscribe(() => {
				const uploadObservables: Observable<number | undefined>[] = [];

				for (let file of arrayUploadingFiles) {
					uploadObservables.push(this.memberService.uploadFile(file));
				}

				const dialogRef = arrayUploadingFiles.length > 0
					? this.dialog.open(
						LoadingPopupComponent, {
							width: '1000px',
							height: '350px',
							maxHeight: '350px',
							disableClose: true,
							data: {
								uploadPercentage: 0,
								message: 'Member updated successfully',
								create: {
									title: 'New member',
									value: 'new-member'
								},
								view: {
									title: 'See members',
									value: 'see-members'
								},
								main: {
									title: 'Main page',
									value: 'main-page'
								}
							} // Initial value, it will be updated
						})
					: this.dialog.open(
						LoadingPopupComponent, {
							width: '1000px',
							height: '350px',
							maxHeight: '350px',
							disableClose: true,
							data: {
								uploadPercentage: 100,
								message: 'Member updated successfully',
								create: {
									title: 'New member',
									value: 'new-member'
								},
								view: {
									title: 'See members',
									value: 'see-members'
								},
								main: {
									title: 'Main page',
									value: 'main-page'
								}
							} // Initial value, it will be updated
						});

				if (uploadObservables.length > 0 ){
					combineLatest(uploadObservables).subscribe(percentages => {
						const totalPercentage = percentages.reduce(
							(total, current) => (total as number) + (current as number), 0
						);
						console.log(`Uploaded percentage ${(totalPercentage as number) / uploadObservables.length}`);
						dialogRef.componentInstance.updateUploadPercentage(
							(totalPercentage as number) / uploadObservables.length
						);
					});
				}

				dialogRef.afterClosed().subscribe(message =>{
					if (message == 'new-member') {
						this.router.navigate(['admin/members/create']);
					}
					if (message == 'main-page') {
						this.router.navigate(['admin']);
					}
					if (message == 'see-members') {
						this.router.navigate(['admin/members/view']);
					}
				});
			});

		} else {
			window.alert('The photo you used has the same name as one already saved. Please change it or change the name.')
		}
	}

	private checkPhotoNames(updatedMember: Member) {
		return this.allMembersPhotoNames.filter(name=> {
			return (
				name == updatedMember.photo
				&&
				name != this.member?.photo as string
			)
		}).length == 0;
	}
}
