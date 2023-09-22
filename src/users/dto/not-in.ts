import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function NotIn(property: string, validationOptions?: ValidationOptions) {  // 인수로 객체에서 참조하려고 하는 다른 속성의 이름과 ValidationOptions을 받음
  return (object: Object, propertyName: string) => {  // registerDecorator를 호출하는 함수를 리턴, 인수로 데커레이터가 선언될 객체와 속성 이름을 받음
    registerDecorator({ // validationDecoratorOptions 객체를 인수로 받음
      name: 'NotIn',  // 데커레이터의 이름을 NotIn으로 설정
      target: object.constructor, // 이 데커레이터는 객체가 생성될 때 적용
      propertyName,
      options: validationOptions, // 유효성 옵션은 데커레이터의 인수로 전달받은 것을 사용
      constraints: [property],  // 이 데커레이터는 속성에 적용되도록 제약을 줌
      validator: {  // 가장 중요한 유효성 검사 규칙이 validator 속성에 기술 됨. 이는 ValidatorConstraintInterface를 구현한 함수
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'string' && typeof relatedValue === 'string' && !relatedValue.includes(value);
        }
      },
    });
  };
}