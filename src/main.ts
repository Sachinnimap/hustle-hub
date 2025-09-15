import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);

 const configService =  app.get(ConfigService)
 
 app.setGlobalPrefix("/api")
 
 app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        
    transform: true,      
      exceptionFactory:([validationErrors]:ValidationError[]=[])=> {
        return new BadRequestException(Object.values(validationErrors.constraints?validationErrors.constraints:'something went wrong')[0])
      }, 
  }));

 const port =  configService.get('port')

  const options = new DocumentBuilder()
    .setTitle('Hustle-hub')
    .setDescription('apis documentation of hustle hub ')
    .setVersion('1.0')
    .addBearerAuth(  
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth', 
    )
    .build();

const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

 await app.listen(port, ()=>{
    console.log(`server running on port : ${port}`)
  });
}
bootstrap(); 
