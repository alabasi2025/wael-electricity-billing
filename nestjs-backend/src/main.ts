// =============================================
// نقطة الدخول الرئيسية (main.ts)
// =============================================
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Global Prefix ───
  app.setGlobalPrefix('api');

  // ─── CORS ───
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ─── Global Validation Pipe ───
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Swagger API Documentation ───
  const config = new DocumentBuilder()
    .setTitle('النظام المحاسبي - API')
    .setDescription(
      'واجهة برمجة التطبيقات للنظام المحاسبي المتخصص لتجار الطاقة الكهربائية',
    )
    .setVersion('2.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('auth', 'المصادقة وتسجيل الدخول')
    .addTag('users', 'إدارة المستخدمين')
    .addTag('invoices', 'إدارة الفواتير (مبيعات + مشتريات)')
    .addTag('reports', 'التقارير المالية')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Documentation - النظام المحاسبي',
    customCss: 'body { direction: ltr; }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
  });

  // ─── Start Server ───
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`
  ⚡ النظام المحاسبي المتخصص لتجار الطاقة الكهربائية
  🚀 Server running on: http://localhost:${port}
  📚 API Docs: http://localhost:${port}/api/docs
  🔗 Angular App: ${process.env.CORS_ORIGIN || 'http://localhost:4200'}
  `);
}
bootstrap();
