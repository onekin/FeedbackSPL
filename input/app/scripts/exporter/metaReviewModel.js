class MetaReviewModel {
  constructor (annotations = []) {
    this.annotations = annotations
  }

  addAnnotation (annotation) {
    this.annotations.push(annotation)
  }

  groupByCriterionInsideLevel (level) {
    let that = this
    let groups = []
    let levelAnnotations = this.annotations.filter((e) => { return e.level === level })
    for (let i in levelAnnotations) {
      if (groups.find((e) => { return e.annotations[0].criterion === levelAnnotations[i].criterion }) != null) continue
      groups.push(new AnnotationGroup(levelAnnotations.filter((e) => { return e.criterion === levelAnnotations[i].criterion }), that))
    }
    return groups
  }

  get promotes () {
    return this.groupByCriterionInsideLevel('Promote')
  }

  get discard () {
    return this.groupByCriterionInsideLevel('Discard')
  }

  toString () {
    let text = '<Summarize the work>\r\n\r\n'

    if (this.promotes.length > 0) {
      // Most important strengths
      let strengths = this.promotes.filter(promote => promote.annotations[0].group === 'Strength')
      text += 'The reviewers found that the strengths of the paper were mostly ' + strengths.length + ':\n'
      strengths.forEach(strength => {
        text += strength.toString() + '\r\n\r\n'
      })
      // Most important weaknesses
      let weaknesses = this.promotes.filter(promote => promote.annotations[0].group === 'Major weakness' || promote.annotations[0].group === 'Minor weakness')
      text += 'Generally speaking, there are ' + weaknesses.length + ' key opportunities for improvement:\n'
      weaknesses.forEach(weakness => {
        text += weakness.toString() + '\r\n\r\n'
      })
      text += '\r\n'
    }

    return text
  }
}

class AnnotationGroup {
  constructor (annotations, review) {
    this._annotations = annotations
    this._review = review
  }
  get annotations () {
    return this._annotations
  }
  toString () {
    let t = this._annotations[0].criterion + ':'
    for (let i in this._annotations) {
      if (this._annotations[i].highlightText === null) continue
      t += '\r\n\t* '
      if (this._annotations[i].page !== null) t += '(Page ' + this._annotations[i].page + '): '
      t += '"' + this._annotations[i].highlightText + '". '
      if (this._annotations[i].comment != null && this._annotations[i].comment !== '') t += '\r\n\t' + this._annotations[i].comment
    }
    return t
  }
}

module.exports = MetaReviewModel
