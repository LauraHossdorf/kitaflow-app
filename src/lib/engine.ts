export type RuleVersion = Readonly<{id:string;version:number;approved:boolean;warningRatio:number|null;criticalRatio:number|null}>;
export type Snapshot = Readonly<{children:number;qualifiedStaff:number}>;
export type Evaluation = {status:"NOT_CONFIGURED"|"INSUFFICIENT_DATA"|"GREEN"|"YELLOW"|"RED";ratio:number|null;ruleVersionId:string|null;engineVersion:"1"};
/** Aggregate information only. No child IDs, rankings, or exclusion decisions. */
export function evaluate(snapshot:Snapshot,rule:RuleVersion|null):Evaluation {
 const base = {ratio:null,ruleVersionId:rule?.id??null,engineVersion:"1" as const};
 if(!rule?.approved || rule.warningRatio===null || rule.criticalRatio===null) return {...base,status:"NOT_CONFIGURED"};
 const {warningRatio:w,criticalRatio:c}=rule;
 if(!Number.isFinite(w)||!Number.isFinite(c)||w<=0||c<=w) throw new Error("INVALID_RULE");
 if(!Number.isInteger(snapshot.children)||!Number.isInteger(snapshot.qualifiedStaff)||snapshot.children<0||snapshot.qualifiedStaff<=0) return {...base,status:"INSUFFICIENT_DATA"};
 const ratio=snapshot.children/snapshot.qualifiedStaff;
 return {...base,ratio,status:ratio>=c?"RED":ratio>=w?"YELLOW":"GREEN"};
}

