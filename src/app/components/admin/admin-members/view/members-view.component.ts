import { Component } from '@angular/core';
import {MemberService} from "../../../../shared/services/model/member/member.service";
import {Member} from "../../../../shared/models/member/member";

@Component({
  selector: 'app-members-view',
  templateUrl: './members-view.component.html',
  styleUrls: [
	  '../../../about/about.component.css',
		'./members-view.component.css'
  ]
})
export class MembersViewComponent {

	isDataLoaded: boolean = false;
	members: Member[] = [];
	membersPhoto: Map<string, string> = new Map();

	constructor(
		private memberService: MemberService,
	) {
		this.memberService.getAll().subscribe(members=> {
			this.members = members;

			this.members.forEach(member=> {
				this.memberService.getMemberPhoto(member.photo!).subscribe(photo=> {
					this.membersPhoto.set(
						member.email!,
						photo
					);
				});
			});

			this.isDataLoaded = true;
		})

	}


}
