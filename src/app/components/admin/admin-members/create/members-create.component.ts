import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {fileTypeValidator} from "../../../../shared/controls/file-type/filetype";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MemberService} from "../../../../shared/services/model/member/member.service";
import {Member} from "../../../../shared/models/member/member";
import {combineLatest, Observable} from "rxjs";
import {LoadingPopupComponent} from "../../../popups/loading-popup/loading-popup.component";

const imageValidator = fileTypeValidator(['png', 'jpg', 'jpeg']);

@Component({
  selector: 'app-members-create',
  templateUrl: './members-create.component.html',
  styleUrls: [
		'../../../../shared/global/css/text-editor.css',
	  './members-create.component.css'
  ]
})
export class MembersCreateComponent {

	submitted: boolean = false;

	allMembers: Member[] = [];
	allMembersPhotosNames: string[] = [];

	memberPhotoUploaded: any;

	memberForm: FormGroup = new FormGroup({
		name: new FormControl(
			'', [
				Validators.required,
			]),
		email: new FormControl(
			'', [
				Validators.required,
				Validators.email,
				Validators.pattern(
					'^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
				)
			]
		),
		surname: new FormControl(
			'', [
				Validators.required
			]),
		faculty: new FormControl(
			'', [
				Validators.required
			]),
		level: new FormControl(
			1, [
				Validators.required
			]),
		role: new FormControl(
			'', [
				Validators.required
			]),
		photo: new FormControl(
			'', [
			Validators.required,
			imageValidator
		]),
		university: new FormControl(
			'', [
			Validators.required
		]),
	});

	constructor(
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private router: Router,
		private memberService: MemberService
	) {
		this.memberService.getAll().subscribe(members=> {
			this.allMembers = members;

			this.memberService.getAllMembersPhotoNames().subscribe(names=> {
				this.allMembersPhotosNames = names;
			});
		})
	}

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
			&&
			this.checkValidityPhoto()
		) {
			this.createNewMember();
		}
	}

	private checkValidityMainInfo(): boolean {
		let validity = true;

		if (this.memberForm.get('email')?.invalid) {
			window.alert("The email is invalid");
			validity = false;
		} else {
			validity = this.allMembers.map(member=>{
				return member.email
			}).filter(email=> {
					return (
						email == this.memberForm.get('email')?.value
					)
				}
			).length == 0;
			if (!validity) {
				window.alert(
					"The email is already used by another member"
				)
			}
		}
		if (this.memberForm.get('name')?.invalid) {
			window.alert("The name is invalid");
			validity = false;
		}
		if (this.memberForm.get('surname')?.invalid) {
			window.alert("The surname is invalid");
			validity = false;
		}
		if (this.memberForm.get('role')?.invalid) {
			window.alert("The role is invalid");
			validity = false;
		}
		if (this.memberForm.get('university')?.invalid) {
			window.alert("The university is invalid");
			validity = false;
		}
		if (this.memberForm.get('level')?.invalid) {
			window.alert("The level is invalid");
			validity = false;
		}
		if (this.memberForm.get('faculty')?.invalid) {
			window.alert("The faculty is invalid");
			validity = false;
		}
		if (this.memberForm.get('photo')?.invalid) {
			window.alert("The photo is invalid");
			validity = false;
		}

		return validity;
	}

	private createNewMember() {
		const arrayUploadingFiles: File[] = [];

		const newMember: Member = new Member();
		arrayUploadingFiles.push(this.memberPhotoUploaded as File);

		newMember.email = this.memberForm.get('email')?.value;
		newMember.name = this.memberForm.get('name')?.value;
		newMember.surname = this.memberForm.get('surname')?.value;
		newMember.level = this.memberForm.get('level')?.value;
		newMember.university = this.memberForm.get('university')?.value;
		newMember.faculty = this.memberForm.get('faculty')?.value;
		newMember.role = this.memberForm.get('role')?.value;

		let fullPath = this.memberForm.get('photo')?.value;
		newMember.photo = fullPath.split('\\').pop();

		this.memberService.create(newMember).subscribe(email=> {
			const uploadObservables: Observable<number | undefined>[] = [];

			for (let file of arrayUploadingFiles) {
				uploadObservables.push(this.memberService.uploadFile(file));
			}

			const dialogRef = this.dialog.open(LoadingPopupComponent, {
				width: '1000px',
				height: '350px',
				maxHeight: '350px',
				disableClose: true,
				data: {
					uploadPercentage: 0,
					message: 'Member created successfully',
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

			combineLatest(uploadObservables).subscribe(percentages => {
				const totalPercentage = percentages.reduce(
					(total, current) => (total as number) + (current as number), 0
				);
				console.log(`Uploaded percentage ${(totalPercentage as number) / uploadObservables.length}`);
				dialogRef.componentInstance.updateUploadPercentage(
					(totalPercentage as number) / uploadObservables.length
				);
			});

			dialogRef.afterClosed().subscribe(message =>{
				if (message == 'new-member') {
					window.location.reload();
				}
				if (message == 'main-page') {
					this.router.navigate(['admin']);
				}
				if (message == 'see-members') {
					this.router.navigate(['admin/members/view']);
				}
			});
		})
	}

	private checkValidityPhoto() {
		let fullPath = this.memberForm.get('photo')?.value;

		if (this.allMembersPhotosNames.filter(photo=> {
			return photo == fullPath.split('\\').pop()
		}).length == 0) {
			return true;
		} else {
			window.alert("The photo you used has the same name as one you have already saved. Please change it.")
			return false;
		}
	}
}
