const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Verifica se o sharp está instalado, caso contrário instala
try {
  require.resolve('sharp');
  console.log('Sharp já está instalado.');
} catch (e) {
  console.log('Instalando sharp...');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
}

const sharp = require('sharp');

// Diretórios de origem e destino
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BUILD_DIR = path.join(__dirname, '..', 'build');

// Extensões de imagem a serem otimizadas
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Configurações de otimização
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 75;

// Função para otimizar imagens
async function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const sharpInstance = sharp(inputPath);
  
  // Redimensiona imagens muito grandes (opcional)
  const metadata = await sharpInstance.metadata();
  if (metadata.width > 1920) {
    sharpInstance.resize(1920);
  }
  
  // Aplica otimizações específicas por formato
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      await sharpInstance
        .jpeg({ quality: JPEG_QUALITY, progressive: true })
        .toFile(outputPath);
      break;
    case '.png':
      await sharpInstance
        .png({ quality: PNG_QUALITY, compressionLevel: 9 })
        .toFile(outputPath);
      break;
    case '.webp':
      await sharpInstance
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);
      break;
    default:
      // Copia arquivos não suportados sem modificação
      fs.copyFileSync(inputPath, outputPath);
      return;
  }
  
  // Calcula e exibe a redução de tamanho
  const originalSize = fs.statSync(inputPath).size;
  const optimizedSize = fs.statSync(outputPath).size;
  const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
  
  console.log(`Otimizado: ${path.basename(inputPath)} - Redução: ${reduction}% (${(originalSize/1024).toFixed(2)}KB → ${(optimizedSize/1024).toFixed(2)}KB)`);
}

// Função para processar recursivamente um diretório
async function processDirectory(inputDir, outputDir) {
  // Cria o diretório de saída se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const entries = fs.readdirSync(inputDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);
    
    if (entry.isDirectory()) {
      // Processa subdiretórios recursivamente
      await processDirectory(inputPath, outputPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      
      if (IMAGE_EXTENSIONS.includes(ext)) {
        // Otimiza imagens
        await optimizeImage(inputPath, outputPath);
      } else {
        // Copia outros arquivos sem modificação
        fs.copyFileSync(inputPath, outputPath);
      }
    }
  }
}

// Função principal
async function main() {
  console.log('Iniciando otimização de imagens...');
  
  try {
    // Processa o diretório public
    await processDirectory(PUBLIC_DIR, BUILD_DIR);
    console.log('Otimização de imagens concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a otimização de imagens:', error);
    process.exit(1);
  }
}

// Executa a função principal
main();